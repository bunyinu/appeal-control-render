
const express = require('express');

const PayersService = require('../services/payers');
const PayersDBApi = require('../db/api/payers');
const wrapAsync = require('../helpers').wrapAsync;



const router = express.Router();

const { parse } = require('json2csv');


const {
    checkCrudPermissions,
} = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('payers'));


/**
 *  @swagger
 *  components:
 *    schemas:
 *      Payers:
 *        type: object
 *        properties:
 
 *          name:
 *            type: string
 *            default: name
 *          payer_code:
 *            type: string
 *            default: payer_code
 *          plan_type:
 *            type: string
 *            default: plan_type
 *          claims_address:
 *            type: string
 *            default: claims_address
 *          fax_number:
 *            type: string
 *            default: fax_number
 *          portal_url:
 *            type: string
 *            default: portal_url
 *          appeals_submission_method:
 *            type: string
 *            default: appeals_submission_method
 *          appeals_contact:
 *            type: string
 *            default: appeals_contact
 
 
 
 */

/**
 *  @swagger
 * tags:
 *   name: Payers
 *   description: The Payers managing API
 */

/**
*  @swagger
*  /api/payers:
*    post:
*      security:
*        - bearerAuth: []
*      tags: [Payers]
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
*                  $ref: "#/components/schemas/Payers"
*      responses:
*        200:
*          description: The item was successfully added
*          content:
*            application/json:
*              schema:
*                $ref: "#/components/schemas/Payers"
*        401:
*          $ref: "#/components/responses/UnauthorizedError"
*        405:
*          description: Invalid input data
*        500:
*          description: Some server error
*/
router.post('/', wrapAsync(async (req, res) => {
    const referer = req.headers.referer || `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const link = new URL(referer);
    await PayersService.create(req.body.data, req.currentUser, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [Payers]
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
 *                $ref: "#/components/schemas/Payers"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/Payers"
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      405:
 *        description: Invalid input data
 *      500:
 *        description: Some server error
 *
 */
router.post('/bulk-import', wrapAsync(async (req, res) => {
    const referer = req.headers.referer || `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const link = new URL(referer);
    await PayersService.bulkImport(req, res, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/payers/{id}:
  *    put:
  *      security:
  *        - bearerAuth: []
  *      tags: [Payers]
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
  *                  $ref: "#/components/schemas/Payers"
  *              required:
  *                - id
  *      responses:
  *        200:
  *          description: The item data was successfully updated
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Payers"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */
router.put('/:id', wrapAsync(async (req, res) => {
  await PayersService.update(req.body.data, req.body.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  * @swagger
  *  /api/payers/{id}:
  *    delete:
  *      security:
  *        - bearerAuth: []
  *      tags: [Payers]
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
  *                $ref: "#/components/schemas/Payers"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */
router.delete('/:id', wrapAsync(async (req, res) => {
  await PayersService.remove(req.params.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/payers/deleteByIds:
  *    post:
  *      security:
  *        - bearerAuth: []
  *      tags: [Payers]
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
  *                $ref: "#/components/schemas/Payers"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Items not found
  *        500:
  *          description: Some server error
  */
router.post('/deleteByIds', wrapAsync(async (req, res) => {
    await PayersService.deleteByIds(req.body.data, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }));

/**
  *  @swagger
  *  /api/payers:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Payers]
  *      summary: Get all payers
  *      description: Get all payers
  *      responses:
  *        200:
  *          description: Payers list successfully received
  *          content:
  *            application/json:
  *              schema:
  *                type: array
  *                items:
  *                  $ref: "#/components/schemas/Payers"
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
  const payload = await PayersDBApi.findAll(
    req.query,  globalAccess,  { currentUser }
  );
  if (filetype && filetype === 'csv') {
    const fields = ['id','name','payer_code','plan_type','claims_address','fax_number','portal_url','appeals_submission_method','appeals_contact',
        
        
      
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
 *  /api/payers/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Payers]
 *      summary: Count all payers
 *      description: Count all payers
 *      responses:
 *        200:
 *          description: Payers count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Payers"
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
    const payload = await PayersDBApi.findAll(
        req.query,
         globalAccess, 
        { countOnly: true, currentUser }
    );

    res.status(200).send(payload);
}));

/**
 *  @swagger
 *  /api/payers/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Payers]
 *      summary: Find all payers that match search criteria
 *      description: Find all payers that match search criteria
 *      responses:
 *        200:
 *          description: Payers list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Payers"
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
   
  
  const payload = await PayersDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    req.query.offset,
     globalAccess,  organizationId,
  );

  res.status(200).send(payload);
});

/**
  * @swagger
  *  /api/payers/{id}:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Payers]
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
  *                $ref: "#/components/schemas/Payers"
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
  const payload = await PayersDBApi.findBy(
    { id: req.params.id },
  );
  
  

  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
