
const express = require('express');

const Activity_logsDBApi = require('../db/api/activity_logs');
const wrapAsync = require('../helpers').wrapAsync;


const router = express.Router();

const { parse } = require('json2csv');


const {
    checkCrudPermissions,
} = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('activity_logs'));


/**
 *  @swagger
 *  components:
 *    schemas:
 *      Activity_logs:
 *        type: object
 *        properties:
 
 *          entity_key:
 *            type: string
 *            default: entity_key
 *          message:
 *            type: string
 *            default: message
 *          ip_address:
 *            type: string
 *            default: ip_address
 
 
 
 *          
 *          
 */

/**
 *  @swagger
 * tags:
 *   name: Activity_logs
 *   description: The Activity_logs managing API
 */

/**
*  @swagger
*  /api/activity_logs:
*    post:
*      security:
*        - bearerAuth: []
*      tags: [Activity_logs]
*      summary: Add new item
*      description: Add new item
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              properties:
*                data:
*                  description: Data of the updated item
*                  type: object
*                  $ref: "#/components/schemas/Activity_logs"
*      responses:
*        200:
*          description: The item was successfully added
*          content:
*            application/json:
*              schema:
*                $ref: "#/components/schemas/Activity_logs"
*        401:
*          $ref: "#/components/responses/UnauthorizedError"
*        405:
*          description: Invalid input data
*        500:
*          description: Some server error
*/


/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [Activity_logs]
 *    summary: Bulk import items
 *    description: Bulk import items
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          properties:
 *            data:
 *              description: Data of the updated items
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Activity_logs"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/Activity_logs"
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      405:
 *        description: Invalid input data
 *      500:
 *        description: Some server error
 *
 */


/**
  *  @swagger
  *  /api/activity_logs/{id}:
  *    put:
  *      security:
  *        - bearerAuth: []
  *      tags: [Activity_logs]
  *      summary: Update the data of the selected item
  *      description: Update the data of the selected item
  *      parameters:
  *        - in: path
  *          name: id
  *          description: Item ID to update
  *          required: true
  *          schema:
  *            type: string
  *      requestBody:
  *        description: Set new item data
  *        required: true
  *        content:
  *          application/json:
  *            schema:
  *              properties:
  *                id:
  *                  description: ID of the updated item
  *                  type: string
  *                data:
  *                  description: Data of the updated item
  *                  type: object
  *                  $ref: "#/components/schemas/Activity_logs"
  *              required:
  *                - id
  *      responses:
  *        200:
  *          description: The item data was successfully updated
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Activity_logs"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */


/**
  * @swagger
  *  /api/activity_logs/{id}:
  *    delete:
  *      security:
  *        - bearerAuth: []
  *      tags: [Activity_logs]
  *      summary: Delete the selected item
  *      description: Delete the selected item
  *      parameters:
  *        - in: path
  *          name: id
  *          description: Item ID to delete
  *          required: true
  *          schema:
  *            type: string
  *      responses:
  *        200:
  *          description: The item was successfully deleted
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Activity_logs"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */


/**
  *  @swagger
  *  /api/activity_logs/deleteByIds:
  *    post:
  *      security:
  *        - bearerAuth: []
  *      tags: [Activity_logs]
  *      summary: Delete the selected item list
  *      description: Delete the selected item list
  *      requestBody:
  *        required: true
  *        content:
  *          application/json:
  *            schema:
  *              properties:
  *                ids:
  *                  description: IDs of the updated items
  *                  type: array
  *      responses:
  *        200:
  *          description: The items was successfully deleted
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Activity_logs"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Items not found
  *        500:
  *          description: Some server error
  */


/**
  *  @swagger
  *  /api/activity_logs:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Activity_logs]
  *      summary: Get all activity_logs
  *      description: Get all activity_logs
  *      responses:
  *        200:
  *          description: Activity_logs list successfully received
  *          content:
  *            application/json:
  *              schema:
  *                type: array
  *                items:
  *                  $ref: "#/components/schemas/Activity_logs"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Data not found
  *        500:
  *          description: Some server error
*/
router.get('/', wrapAsync(async (req, res) => {
  const filetype = req.query.filetype
  
  const globalAccess = req.currentUser.app_role.globalAccess;
  
  const currentUser = req.currentUser;
  const payload = await Activity_logsDBApi.findAll(
    req.query,  globalAccess,  { currentUser }
  );
  if (filetype && filetype === 'csv') {
    const fields = ['id','entity_key','message','ip_address',
        
        
      'occurred_at',
        ];
    const opts = { fields };
    try {
      const csv = parse(payload.rows, opts);
      res.status(200).attachment(csv);
      res.send(csv)

    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(200).send(payload);
  }

}));

/**
 *  @swagger
 *  /api/activity_logs/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Activity_logs]
 *      summary: Count all activity_logs
 *      description: Count all activity_logs
 *      responses:
 *        200:
 *          description: Activity_logs count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Activity_logs"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/count', wrapAsync(async (req, res) => {
  
  const globalAccess = req.currentUser.app_role.globalAccess;
  
    const currentUser = req.currentUser;
    const payload = await Activity_logsDBApi.findAll(
        req.query,
         globalAccess, 
        { countOnly: true, currentUser }
    );

    res.status(200).send(payload);
}));

/**
 *  @swagger
 *  /api/activity_logs/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Activity_logs]
 *      summary: Find all activity_logs that match search criteria
 *      description: Find all activity_logs that match search criteria
 *      responses:
 *        200:
 *          description: Activity_logs list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Activity_logs"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/autocomplete', async (req, res) => {
  
  const globalAccess = req.currentUser.app_role.globalAccess;
    
  const organizationId =  req.currentUser.organization?.id
   
  
  const payload = await Activity_logsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    req.query.offset,
     globalAccess,  organizationId,
  );

  res.status(200).send(payload);
});

/**
  * @swagger
  *  /api/activity_logs/{id}:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Activity_logs]
  *      summary: Get selected item
  *      description: Get selected item
  *      parameters:
  *        - in: path
  *          name: id
  *          description: ID of item to get
  *          required: true
  *          schema:
  *            type: string
  *      responses:
  *        200:
  *          description: Selected item successfully received
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Activity_logs"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */
router.get('/:id', wrapAsync(async (req, res) => {
  const payload = await Activity_logsDBApi.findBy(
    { id: req.params.id },
  );
  
  

  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
