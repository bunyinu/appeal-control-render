const db = require('../db/models');
const ValidationError = require('./notifications/errors/validation');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

/**
 * @param {string} permission
 * @param {object} currentUser
 */
async function checkPermissions(permission, currentUser) {

  if (!currentUser) {
    throw new ValidationError('auth.unauthorized');
  }

  const userPermission = currentUser.custom_permissions.find(
    (cp) => cp.name === permission,
  );

  if (userPermission) {
    return true;
  }

  if (!currentUser.app_role) {
    throw new ValidationError('auth.forbidden');
  }

  const permissions = await currentUser.app_role.getPermissions();

  return !!permissions.find((p) => p.name === permission);
}

module.exports = class SearchService {
  static async search(searchQuery, currentUser , organizationId, globalAccess) {
      if (!searchQuery) {
        throw new ValidationError('iam.errors.searchQueryRequired');
      }
      const tableColumns = {
        
          
          

          
            "users": [
              
                "firstName",
              
                "lastName",
              
                "phoneNumber",
              
                "email",
              
            ],
          
        
          
          
          
          

          
            "organizations": [
              
                "name",
              
            ],
          
        
          
          

          
            "payers": [
              
                "name",
              
                "payer_code",
              
                "plan_type",
              
                "claims_address",
              
                "fax_number",
              
                "portal_url",
              
                "appeals_submission_method",
              
                "appeals_contact",
              
            ],
          
        
          
          

          
            "cases": [
              
                "case_number",
              
                "patient_name",
              
                "member_id",
              
                "procedure_code",
              
                "diagnosis_code",
              
                "denial_reason_code",
              
                "denial_reason",
              
                "facility_name",
              
                "ordering_provider",
              
            ],
          
        
          
          

          
            "tasks": [
              
                "title",
              
                "description",
              
            ],
          
        
          
          

          
            "documents": [
              
                "title",
              
                "description",
              
            ],
          
        
          
          

          
            "appeal_drafts": [
              
                "title",
              
                "content",
              
            ],
          
        
          
          

          
            "notes": [
              
                "title",
              
                "body",
              
            ],
          
        
          
          

          
            "activity_logs": [
              
                "entity_key",
              
                "message",
              
                "ip_address",
              
            ],
          
        
          
          

          
            "settings": [
              
                "key",
              
                "value",
              
                "description",
              
            ],
          
        
      };
      const columnsInt = {
        
          
          
          
        
          
          
          
          
          
        
          
          
          
        
          
          
          
            "cases": [
              
                "amount_at_risk",
              
            ],
          
        
          
          
          
        
          
          
          
        
          
          
          
        
          
          
          
        
          
          
          
        
          
          
          
        
      };

      let allFoundRecords = [];

      for (const tableName in tableColumns) {
        if (Object.prototype.hasOwnProperty.call(tableColumns, tableName)) {
          const attributesToSearch = tableColumns[tableName];
          const attributesIntToSearch = columnsInt[tableName] || [];
          const whereCondition = {
            [Op.or]: [
              ...attributesToSearch.map(attribute => ({
                [attribute]: {
                  [Op.iLike] : `%${searchQuery}%`,
                },
              })),
              ...attributesIntToSearch.map(attribute => (
                Sequelize.where(
                  Sequelize.cast(Sequelize.col(`${tableName}.${attribute}`), 'varchar'),
                  { [Op.iLike]: `%${searchQuery}%` }
                )
              )),
            ],
          };

           
          if (!globalAccess && tableName !== 'organizations' && organizationId) {
            whereCondition.organizationId = organizationId;
          }
          

          const hasPermission = await checkPermissions(`READ_${tableName.toUpperCase()}`, currentUser);
          if (!hasPermission) {
            continue;
          }

          const foundRecords = await db[tableName].findAll({
            where: whereCondition,
            attributes: [...tableColumns[tableName], 'id', ...attributesIntToSearch],
          });
      
          const modifiedRecords = foundRecords.map((record) => {
            const matchAttribute = [];
 
            for (const attribute of attributesToSearch) {
              if (record[attribute]?.toLowerCase()?.includes(searchQuery.toLowerCase())) {
                matchAttribute.push(attribute);
              }
            }

            for (const attribute of attributesIntToSearch) {
              const castedValue = String(record[attribute]);
              if (castedValue && castedValue.toLowerCase().includes(searchQuery.toLowerCase())) {
                matchAttribute.push(attribute);
              }
            }
      
            return {
              ...record.get(),
              matchAttribute,
              tableName,
            };
          });

          allFoundRecords = allFoundRecords.concat(modifiedRecords);
        }
      }

      return allFoundRecords;
  }
}
