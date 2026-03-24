const axios = require('axios');
const config = require('../config');
const { LocalAIApi } = require('../ai/LocalAIApi');
const { redactSensitiveData } = require('../helpers/security');

const loadRoleService = () => {
  try {
    return require('./roles');
  } catch (error) {
    console.error('Role service is missing for AI widget generation', redactSensitiveData(error));
    const err = new Error('Role service is missing. Advanced roles are required for this operation.');
    err.originalError = error;
    throw err;
  }
};

module.exports = class OpenAiService {
  static async getWidget(payload, userId, roleId) {
    const RoleService = loadRoleService();
    const response = await axios.post(
      `${config.flHost}/${config.project_uuid}/project_customization_widgets.json`,
      payload,
    );

    if (response.status >= 200 && response.status < 300) {
      const { widget_id } = await response.data;
      await RoleService.addRoleInfo(roleId, userId, 'widgets', widget_id);
      return widget_id;
    } else {
      console.error('AI widget generation failed', redactSensitiveData(response.data));
      return { value: null, error: response.data };
    }
  }

  static async askGpt(prompt) {
    if (!prompt) {
      return {
        success: false,
        error: 'Prompt is required'
      };
    }

    const response = await LocalAIApi.createResponse(
      {
        input: [{ role: 'user', content: prompt }],
      },
      {
        poll_interval: 5,
        poll_timeout: 300,
      },
    );

    if (response.success) {
      let text = LocalAIApi.extractText(response);
      if (!text) {
        try {
          const decoded = LocalAIApi.decodeJsonFromResponse(response);
          text = JSON.stringify(decoded);
        } catch (error) {
          console.error('AI JSON decode failed', redactSensitiveData(error));
          return {
            success: false,
            error: 'AI response parsing failed',
          };
        }
      }
      return {
        success: true,
        data: text,
      };
    }

    console.error('AI proxy error', redactSensitiveData(response));
    return {
      success: false,
      error: response.error || response.message || 'AI proxy error',
    };
  }
};
