module.exports = class Activity_logsService {
  static async create() { throw new Error('ActivityLogs are read-only'); }
  static async bulkImport() { throw new Error('ActivityLogs are read-only'); }
  static async update() { throw new Error('ActivityLogs are read-only'); }
  static async deleteByIds() { throw new Error('ActivityLogs are read-only'); }
  static async remove() { throw new Error('ActivityLogs are read-only'); }
};

