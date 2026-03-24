"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { URL } = require("url");

let CONFIG_CACHE = null;

class LocalAIApi {
  static createResponse(params, options) {
    return createResponse(params, options);
  }

  static request(pathValue, payload, options) {
    return request(pathValue, payload, options);
  }

  static fetchStatus(aiRequestId, options) {
    return fetchStatus(aiRequestId, options);
  }

  static awaitResponse(aiRequestId, options) {
    return awaitResponse(aiRequestId, options);
  }

  static extractText(response) {
    return extractText(response);
  }

  static decodeJsonFromResponse(response) {
    return decodeJsonFromResponse(response);
  }
}

async function createResponse(params, options = {}) {
  const payload = { ...(params || {}) };

  if (!Array.isArray(payload.input) || payload.input.length === 0) {
    return {
      success: false,
      error: "input_missing",
      message: 'Parameter "input" is required and must be a non-empty array.',
    };
  }

  const cfg = config();
  if (!payload.model) {
    payload.model = cfg.defaultModel;
  }

  const initial = await request(options.path, payload, options);
  if (!initial.success) {
    return initial;
  }

  const data = initial.data;
  if (data && typeof data === "object" && data.ai_request_id) {
    const pollTimeout = Number(options.poll_timeout ?? 300);
    const pollInterval = Number(options.poll_interval ?? 5);
    return await awaitResponse(data.ai_request_id, {
      interval: pollInterval,
      timeout: pollTimeout,
      headers: options.headers,
      timeout_per_call: options.timeout,
      verify_tls: options.verify_tls,
    });
  }

  return initial;
}

async function request(pathValue, payload = {}, options = {}) {
  const cfg = config();
  const resolvedPath = pathValue || options.path || cfg.responsesPath;

  if (!resolvedPath) {
    return {
      success: false,
      error: "project_id_missing",
      message: "PROJECT_ID is not defined; cannot resolve AI proxy endpoint.",
    };
  }

  if (!cfg.baseUrl) {
    return {
      success: false,
      error: "ai_proxy_base_url_missing",
      message: "AI_PROXY_BASE_URL is not defined; aborting AI request.",
    };
  }

  if (!cfg.projectUuid) {
    return {
      success: false,
      error: "project_uuid_missing",
      message: "PROJECT_UUID is not defined; aborting AI request.",
    };
  }

  const bodyPayload = { ...(payload || {}) };
  if (!bodyPayload.project_uuid) {
    bodyPayload.project_uuid = cfg.projectUuid;
  }

  const url = buildUrl(resolvedPath, cfg.baseUrl);
  const timeout = resolveTimeout(options.timeout, cfg.timeout);
  const verifyTls = resolveVerifyTls(options.verify_tls, cfg.verifyTls);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    [cfg.projectHeader]: cfg.projectUuid,
  };
  if (Array.isArray(options.headers)) {
    for (const header of options.headers) {
      if (typeof header === "string" && header.includes(":")) {
        const [name, value] = header.split(":", 2);
        headers[name.trim()] = value.trim();
      }
    }
  }

  const body = JSON.stringify(bodyPayload);
  return sendRequest(url, "POST", body, headers, timeout, verifyTls);
}

async function fetchStatus(aiRequestId, options = {}) {
  const cfg = config();
  if (!cfg.baseUrl) {
    return {
      success: false,
      error: "ai_proxy_base_url_missing",
      message: "AI_PROXY_BASE_URL is not defined; aborting status check.",
    };
  }

  if (!cfg.projectUuid) {
    return {
      success: false,
      error: "project_uuid_missing",
      message: "PROJECT_UUID is not defined; aborting status check.",
    };
  }

  const statusPath = resolveStatusPath(aiRequestId, cfg);
  const url = buildUrl(statusPath, cfg.baseUrl);
  const timeout = resolveTimeout(options.timeout, cfg.timeout);
  const verifyTls = resolveVerifyTls(options.verify_tls, cfg.verifyTls);

  const headers = {
    Accept: "application/json",
    [cfg.projectHeader]: cfg.projectUuid,
  };
  if (Array.isArray(options.headers)) {
    for (const header of options.headers) {
      if (typeof header === "string" && header.includes(":")) {
        const [name, value] = header.split(":", 2);
        headers[name.trim()] = value.trim();
      }
    }
  }

  return sendRequest(url, "GET", null, headers, timeout, verifyTls);
}

async function awaitResponse(aiRequestId, options = {}) {
  const timeout = Number(options.timeout ?? 300);
  const interval = Math.max(Number(options.interval ?? 5), 1);
  const deadline = Date.now() + Math.max(timeout, interval) * 1000;

  for (;;) {
    const statusResp = await fetchStatus(aiRequestId, {
      headers: options.headers,
      timeout: options.timeout_per_call,
      verify_tls: options.verify_tls,
    });

    if (statusResp.success) {
      const data = statusResp.data || {};
      if (data && typeof data === "object") {
        if (data.status === "success") {
          return {
            success: true,
            status: 200,
            data: data.response || data,
          };
        }
        if (data.status === "failed") {
          return {
            success: false,
            status: 500,
            error: String(data.error || "AI request failed"),
            data,
          };
        }
      }
    } else {
      return statusResp;
    }

    if (Date.now() >= deadline) {
      return {
        success: false,
        error: "timeout",
        message: "Timed out waiting for AI response.",
      };
    }

    await sleep(interval * 1000);
  }
}

function extractText(response) {
  const payload = response && typeof response === "object" ? response.data || response : null;
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (Array.isArray(payload.output)) {
    let combined = "";
    for (const item of payload.output) {
      if (!item || !Array.isArray(item.content)) {
        continue;
      }
      for (const block of item.content) {
        if (
          block &&
          typeof block === "object" &&
          block.type === "output_text" &&
          typeof block.text === "string" &&
          block.text.length > 0
        ) {
          combined += block.text;
        }
      }
    }
    if (combined) {
      return combined;
    }
  }

  if (
    payload.choices &&
    payload.choices[0] &&
    payload.choices[0].message &&
    typeof payload.choices[0].message.content === "string"
  ) {
    return payload.choices[0].message.content;
  }

  return "";
}

function decodeJsonFromResponse(response) {
  const text = extractText(response);
  if (!text) {
    throw new Error("No text found in AI response.");
  }

  const parsed = parseJson(text);
  if (parsed.ok && parsed.value && typeof parsed.value === "object") {
    return parsed.value;
  }

  const stripped = stripJsonFence(text);
  if (stripped !== text) {
    const parsedStripped = parseJson(stripped);
    if (parsedStripped.ok && parsedStripped.value && typeof parsedStripped.value === "object") {
      return parsedStripped.value;
    }
    throw new Error(`JSON parse failed after stripping fences: ${parsedStripped.error}`);
  }

  throw new Error(`JSON parse failed: ${parsed.error}`);
}

function config() {
  if (CONFIG_CACHE) {
    return CONFIG_CACHE;
  }

  ensureEnvLoaded();

  const baseUrl = process.env.AI_PROXY_BASE_URL || "";
  const projectId = process.env.PROJECT_ID || null;
  let responsesPath = process.env.AI_RESPONSES_PATH || null;
  if (!responsesPath && projectId) {
    responsesPath = `/projects/${projectId}/ai-request`;
  }

  const timeout = resolveTimeout(process.env.AI_TIMEOUT, 30);
  const verifyTls = resolveVerifyTls(process.env.AI_VERIFY_TLS, true);

  CONFIG_CACHE = {
    baseUrl,
    responsesPath,
    projectId,
    projectUuid: process.env.PROJECT_UUID || null,
    projectHeader: process.env.AI_PROJECT_HEADER || "project-uuid",
    defaultModel: process.env.AI_DEFAULT_MODEL || "gpt-5-mini",
    timeout,
    verifyTls,
  };

  return CONFIG_CACHE;
}

function buildUrl(pathValue, baseUrl) {
  const trimmed = String(pathValue || "").trim();
  if (trimmed === "") {
    return baseUrl;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return `${baseUrl}${trimmed}`;
  }
  return `${baseUrl}/${trimmed}`;
}

function resolveStatusPath(aiRequestId, cfg) {
  const basePath = (cfg.responsesPath || "").replace(/\/+$/, "");
  if (!basePath) {
    return `/ai-request/${encodeURIComponent(String(aiRequestId))}/status`;
  }
  const normalized = basePath.endsWith("/ai-request") ? basePath : `${basePath}/ai-request`;
  return `${normalized}/${encodeURIComponent(String(aiRequestId))}/status`;
}

function sendRequest(urlString, method, body, headers, timeoutSeconds, verifyTls) {
  return new Promise((resolve) => {
    let targetUrl;
    try {
      targetUrl = new URL(urlString);
    } catch (err) {
      resolve({
        success: false,
        error: "invalid_url",
        message: err.message,
      });
      return;
    }

    const isHttps = targetUrl.protocol === "https:";
    const requestFn = isHttps ? https.request : http.request;
    const options = {
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port || (isHttps ? 443 : 80),
      path: `${targetUrl.pathname}${targetUrl.search}`,
      method: method.toUpperCase(),
      headers,
      timeout: Math.max(Number(timeoutSeconds || 30), 1) * 1000,
    };
    if (isHttps) {
      options.rejectUnauthorized = Boolean(verifyTls);
    }

    const req = requestFn(options, (res) => {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        const status = res.statusCode || 0;
        const parsed = parseJson(responseBody);
        const payload = parsed.ok ? parsed.value : responseBody;

        if (status >= 200 && status < 300) {
          const result = {
            success: true,
            status,
            data: payload,
          };
          if (!parsed.ok) {
            result.json_error = parsed.error;
          }
          resolve(result);
          return;
        }

        const errorMessage =
          parsed.ok && payload && typeof payload === "object"
            ? String(payload.error || payload.message || "AI proxy request failed")
            : String(responseBody || "AI proxy request failed");

        resolve({
          success: false,
          status,
          error: errorMessage,
          response: payload,
          json_error: parsed.ok ? undefined : parsed.error,
        });
      });
    });

    req.on("timeout", () => {
      req.destroy(new Error("request_timeout"));
    });

    req.on("error", (err) => {
      resolve({
        success: false,
        error: "request_failed",
        message: err.message,
      });
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function parseJson(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return { ok: false, error: "empty_response" };
  }
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function stripJsonFence(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```json")) {
    return trimmed.replace(/^```json/, "").replace(/```$/, "").trim();
  }
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```/, "").replace(/```$/, "").trim();
  }
  return text;
}

function resolveTimeout(value, fallback) {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Number.isNaN(parsed) ? Number(fallback) : parsed;
}

function resolveVerifyTls(value, fallback) {
  if (value === undefined || value === null) {
    return Boolean(fallback);
  }
  return String(value).toLowerCase() !== "false" && String(value) !== "0";
}

function ensureEnvLoaded() {
  if (process.env.PROJECT_UUID && process.env.PROJECT_ID) {
    return;
  }

  const envPath = path.resolve(__dirname, "../../../../.env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  let content;
  try {
    content = fs.readFileSync(envPath, "utf8");
  } catch (err) {
    throw new Error(`Failed to read executor .env: ${err.message}`);
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const [rawKey, ...rest] = trimmed.split("=");
    const key = rawKey.trim();
    if (!key) {
      continue;
    }
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  LocalAIApi,
  createResponse,
  request,
  fetchStatus,
  awaitResponse,
  extractText,
  decodeJsonFromResponse,
};
