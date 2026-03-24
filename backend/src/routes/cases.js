
const express = require('express');

const CasesService = require('../services/cases');
const AppealDashboardService = require('../services/appealDashboard');
const CasesDBApi = require('../db/api/cases');
const wrapAsync = require('../helpers').wrapAsync;



const router = express.Router();

const { parse } = require('json2csv');


const {
    checkCrudPermissions,
} = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('cases'));


/**
 *  @swagger
 *  components:
 *    schemas:
 *      Cases:
 *        type: object
 *        properties:
 
 *          case_number:
 *            type: string
 *            default: case_number
 *          patient_name:
 *            type: string
 *            default: patient_name
 *          member_id:
 *            type: string
 *            default: member_id
 *          procedure_code:
 *            type: string
 *            default: procedure_code
 *          diagnosis_code:
 *            type: string
 *            default: diagnosis_code
 *          denial_reason_code:
 *            type: string
 *            default: denial_reason_code
 *          denial_reason:
 *            type: string
 *            default: denial_reason
 *          facility_name:
 *            type: string
 *            default: facility_name
 *          ordering_provider:
 *            type: string
 *            default: ordering_provider
 
 
 *          amount_at_risk:
 *            type: integer
 *            format: int64
 
 *          
 *          
 *          
 */

/**
 *  @swagger
 * tags:
 *   name: Cases
 *   description: The Cases managing API
 */

/**
*  @swagger
*  /api/cases:
*    post:
*      security:
*        - bearerAuth: []
*      tags: [Cases]
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
*                  $ref: "#/components/schemas/Cases"
*      responses:
*        200:
*          description: The item was successfully added
*          content:
*            application/json:
*              schema:
*                $ref: "#/components/schemas/Cases"
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
    await CasesService.create(req.body.data, req.currentUser, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [Cases]
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
 *                $ref: "#/components/schemas/Cases"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/Cases"
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
    await CasesService.bulkImport(req, res, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/cases/{id}:
  *    put:
  *      security:
  *        - bearerAuth: []
  *      tags: [Cases]
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
  *                  $ref: "#/components/schemas/Cases"
  *              required:
  *                - id
  *      responses:
  *        200:
  *          description: The item data was successfully updated
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/Cases"
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
  await CasesService.update(req.body.data, req.body.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  * @swagger
  *  /api/cases/{id}:
  *    delete:
  *      security:
  *        - bearerAuth: []
  *      tags: [Cases]
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
  *                $ref: "#/components/schemas/Cases"
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
  await CasesService.remove(req.params.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/cases/deleteByIds:
  *    post:
  *      security:
  *        - bearerAuth: []
  *      tags: [Cases]
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
  *                $ref: "#/components/schemas/Cases"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Items not found
  *        500:
  *          description: Some server error
  */
router.post('/deleteByIds', wrapAsync(async (req, res) => {
    await CasesService.deleteByIds(req.body.data, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }));

/**
  *  @swagger
  *  /api/cases:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Cases]
  *      summary: Get all cases
  *      description: Get all cases
  *      responses:
  *        200:
  *          description: Cases list successfully received
  *          content:
  *            application/json:
  *              schema:
  *                type: array
  *                items:
  *                  $ref: "#/components/schemas/Cases"
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
  const payload = await CasesDBApi.findAll(
    req.query,  globalAccess,  { currentUser }
  );
  if (filetype && filetype === 'csv') {
    const fields = ['id','case_number','patient_name','member_id','procedure_code','diagnosis_code','denial_reason_code','denial_reason','facility_name','ordering_provider',
        
        'amount_at_risk',
      'patient_dob','submitted_at','due_at','closed_at',
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
 *  /api/cases/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Cases]
 *      summary: Count all cases
 *      description: Count all cases
 *      responses:
 *        200:
 *          description: Cases count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Cases"
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
    const payload = await CasesDBApi.findAll(
        req.query,
         globalAccess, 
        { countOnly: true, currentUser }
    );

    res.status(200).send(payload);
}));

/**
 *  @swagger
 *  /api/cases/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Cases]
 *      summary: Find all cases that match search criteria
 *      description: Find all cases that match search criteria
 *      responses:
 *        200:
 *          description: Cases list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Cases"
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
   
  
  const payload = await CasesDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    req.query.offset,
     globalAccess,  organizationId,
  );

  res.status(200).send(payload);
});

router.get('/appeal-dashboard', wrapAsync(async (req, res) => {
  const payload = await AppealDashboardService.getSummary(req.currentUser);

  res.status(200).send(payload);
}));

/**
  * @swagger
  *  /api/cases/{id}:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [Cases]
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
  *                $ref: "#/components/schemas/Cases"
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
  const payload = await CasesDBApi.findBy(
    { id: req.params.id },
  );
  
  

  res.status(200).send(payload);
}));


router.put('/:id/assign-owner', wrapAsync(async (req, res) => {
  const payload = await CasesService.assignOwner(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/change-status', wrapAsync(async (req, res) => {
  const payload = await CasesService.changeStatus(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/reopen', wrapAsync(async (req, res) => {
  const payload = await CasesService.reopen(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/mark-won', wrapAsync(async (req, res) => {
  const payload = await CasesService.markWon(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/mark-lost', wrapAsync(async (req, res) => {
  const payload = await CasesService.markLost(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));


router.put('/:id/submit-appeal', wrapAsync(async (req, res) => {
  const payload = await CasesService.submitAppeal(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);



module.exports = router;
