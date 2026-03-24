#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');

const backendRoot = path.resolve(__dirname, '..');
const targetPatterns = ['src/**/*.js', 'tests/**/*.js'];
const supportedRules = new Set([
  'no-unused-vars',
  'no-constant-condition',
  'no-sparse-arrays',
  'no-prototype-builtins',
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractUnusedName(messageText) {
  const match = messageText.match(/'([^']+)'/);
  return match ? match[1] : null;
}

function removeParameterFromLine(line, name) {
  const openIndex = line.indexOf('(');
  const closeIndex = line.lastIndexOf(')');

  if (openIndex === -1 || closeIndex === -1 || closeIndex <= openIndex) {
    return line;
  }

  const paramsSource = line.slice(openIndex + 1, closeIndex);
  const params = paramsSource
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (!params.length) {
    return line;
  }

  const nextParams = params.filter((part) => {
    const normalizedPart = part
      .replace(/^\.{3}/, '')
      .split('=')[0]
      .trim();

    return normalizedPart !== name;
  });

  if (nextParams.length === params.length) {
    return line;
  }

  return `${line.slice(0, openIndex + 1)}${nextParams.join(', ')}${line.slice(closeIndex)}`;
}

function applyUnusedVarFix(lines, lineIndex, name) {
  const line = lines[lineIndex] || '';
  const escapedName = escapeRegExp(name);
  const directRequirePattern = new RegExp(
    `^\\s*const\\s+${escapedName}\\s*=\\s*require\\(`,
  );
  const directAssignmentPattern = new RegExp(
    `^\\s*(const|let|var)\\s+${escapedName}\\s*=`,
  );
  const singleDestructurePattern = new RegExp(
    `^\\s*(const|let|var)\\s*\\{\\s*${escapedName}\\s*\\}\\s*=`,
  );

  if (
    directRequirePattern.test(line) ||
    directAssignmentPattern.test(line) ||
    singleDestructurePattern.test(line)
  ) {
    lines.splice(lineIndex, 1);
    return true;
  }

  const nextLine = removeParameterFromLine(line, name);

  if (nextLine !== line) {
    lines[lineIndex] = nextLine;
    return true;
  }

  return false;
}

function applyKnownRuleFix(lines, message) {
  const lineIndex = message.line - 1;
  const line = lines[lineIndex] || '';

  if (message.ruleId === 'no-unused-vars') {
    const name = extractUnusedName(message.message);

    if (!name) {
      return false;
    }

    return applyUnusedVarFix(lines, lineIndex, name);
  }

  if (message.ruleId === 'no-constant-condition') {
    if (line.includes('while (true)')) {
      lines[lineIndex] = line.replace(/while\s*\(\s*true\s*\)/g, 'for (;;)');
      return true;
    }

    return false;
  }

  if (message.ruleId === 'no-sparse-arrays') {
    if (line.includes(',,')) {
      lines[lineIndex] = line.replace(/,\s*,+/g, ',');
      return true;
    }

    return false;
  }

  if (message.ruleId === 'no-prototype-builtins') {
    const replaced = line.replace(
      /([A-Za-z0-9_$.[\]]+)\.hasOwnProperty\(([^)]+)\)/g,
      'Object.prototype.hasOwnProperty.call($1, $2)',
    );

    if (replaced !== line) {
      lines[lineIndex] = replaced;
      return true;
    }
  }

  return false;
}

function normalizeWhitespace(content) {
  return content
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n');
}

function applyMessageFixes(filePath, messages) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const lines = originalContent.split('\n');
  const sortedMessages = [...messages].sort(
    (left, right) => right.line - left.line || right.column - left.column,
  );
  let changed = false;

  for (const message of sortedMessages) {
    if (!supportedRules.has(message.ruleId)) {
      continue;
    }

    if (applyKnownRuleFix(lines, message)) {
      changed = true;
    }
  }

  if (!changed) {
    return false;
  }

  const nextContent = normalizeWhitespace(lines.join('\n'));

  if (nextContent !== originalContent) {
    fs.writeFileSync(filePath, nextContent);
    return true;
  }

  return false;
}

async function lintAndNormalize() {
  const eslint = new ESLint({ cwd: backendRoot, fix: true });
  const touchedFiles = new Set();

  for (let pass = 0; pass < 4; pass += 1) {
    const results = await eslint.lintFiles(targetPatterns);
    await ESLint.outputFixes(results);

    let changedInPass = false;

    for (const result of results) {
      const relevantMessages = result.messages.filter((message) =>
        supportedRules.has(message.ruleId),
      );

      if (!relevantMessages.length) {
        continue;
      }

      if (applyMessageFixes(result.filePath, relevantMessages)) {
        touchedFiles.add(path.relative(backendRoot, result.filePath));
        changedInPass = true;
      }
    }

    if (!changedInPass) {
      break;
    }
  }

  const finalLint = new ESLint({ cwd: backendRoot, fix: true });
  const finalResults = await finalLint.lintFiles(targetPatterns);
  await ESLint.outputFixes(finalResults);

  if (touchedFiles.size) {
    console.log(
      `Normalized generated backend files (${touchedFiles.size}): ${[...touchedFiles]
        .sort()
        .join(', ')}`,
    );
  } else {
    console.log('Generated backend files already normalized.');
  }
}

lintAndNormalize().catch((error) => {
  console.error(error);
  process.exit(1);
});
