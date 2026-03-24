
const express = require('express');

const Appeal_draftsService = require('../services/appeal_drafts');
const Appeal_draftsDBApi = require('../db/api/appeal_drafts');
const wrapAsync = require('../helpers').wrapAsync;



const router = express.Router();

const { parse } = require('json2csv');


const {
    checkCrudPermissions,
} = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('appeal_drafts'));


/**
 *  @swagger
 *  components:
 *    schemas:
 *      Appeal_drafts:
 *        type: object
 *        properties:
 
 *          title:
 *            type: string
 *            default: title
 *          content:
 *            type: string
 *            default: content
 
 
 
 *          
 */

/**
 *  @swagger
 * tags:
 *   name: Appeal_drafts
 *   description: The Appeal_drafts managing API
 */

/**
*  @swagger
*  /api/appeal_drafts:
*    post:
*      security:
*        - bearerAuth: []
*      tags: [Appeal_drafts]
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
*                  $ref: "#/components/schemas/Appeal_drafts"
*      responses:
*        200:
*          description: The item was successfully added
*          content:
*            application/json:
*              schema:
*                $ref: "#/components/schemas/Appeal_drafts"
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
    await Appeal_draftsService.create(req.body.data, req.currentUser, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [Appeal_drafts]
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
 *                $ref: "#/components/schemas/Appeal_drafts"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/Appeal_drafts"
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
    await Appeal_draftsService.bulkImport(req, res, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/appeal_drafts/{id}:
  *    put:
  *      security:
  *        - bearerAuth: []
  *      tags: [Appeal_drafts]
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
  *                  $ref: "#/components/schemas/Appeal_drafts"
  *              required:
  *                - id
  *      responses:
  *        200:
  *          description: The item data was successfully updated
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Appeal_drafts"
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
  await Appeal_draftsService.update(req.body.data, req.body.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  * @swagger
  *  /api/appeal_drafts/{id}:
  *    delete:
  *      security:
  *        - bearerAuth: []
  *      tags: [Appeal_drafts]
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
  *                $ref: "#/components/schemas/Appeal_drafts"
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
  await Appeal_draftsService.remove(req.params.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/appeal_drafts/deleteByIds:
  *    post:
  *      security:
  *        - bearerAuth: []
  *      tags: [Appeal_drafts]
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
  *                $ref: "#/components/schemas/Appeal_drafts"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Items not found
  *        500:
  *          description: Some server error
  */
router.post('/deleteByIds', wrapAsync(async (req, res) => {
    await Appeal_draftsService.deleteByIds(req.body.data, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }));

/**
  *  @swagger
  *  /api/appeal_drafts:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Appeal_drafts]
  *      summary: Get all appeal_drafts
  *      description: Get all appeal_drafts
  *      responses:
  *        200:
  *          description: Appeal_drafts list successfully received
  *          content:
  *            application/json:
  *              schema:
  *                type: array
  *                items:
  *                  $ref: "#/components/schemas/Appeal_drafts"
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
  const payload = await Appeal_draftsDBApi.findAll(
    req.query,  globalAccess,  { currentUser }
  );
  if (filetype && filetype === 'csv') {
    const fields = ['id','title','content',
        
        
      'submitted_at',
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
 *  /api/appeal_drafts/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Appeal_drafts]
 *      summary: Count all appeal_drafts
 *      description: Count all appeal_drafts
 *      responses:
 *        200:
 *          description: Appeal_drafts count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Appeal_drafts"
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
    const payload = await Appeal_draftsDBApi.findAll(
        req.query,
         globalAccess, 
        { countOnly: true, currentUser }
    );

    res.status(200).send(payload);
}));

/**
 *  @swagger
 *  /api/appeal_drafts/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Appeal_drafts]
 *      summary: Find all appeal_drafts that match search criteria
 *      description: Find all appeal_drafts that match search criteria
 *      responses:
 *        200:
 *          description: Appeal_drafts list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Appeal_drafts"
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
   
  
  const payload = await Appeal_draftsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    req.query.offset,
     globalAccess,  organizationId,
  );

  res.status(200).send(payload);
});

/**
  * @swagger
  *  /api/appeal_drafts/{id}:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Appeal_drafts]
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
  *                $ref: "#/components/schemas/Appeal_drafts"
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
  const payload = await Appeal_draftsDBApi.findBy(
    { id: req.params.id },
  );
  
  

  res.status(200).send(payload);
}));


router.put('/:id/submit', wrapAsync(async (req, res) => {
  const payload = await Appeal_draftsService.submit(
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);


module.exports = router;
