const express = require('express');

const { body, validationResult, query } = require('express-validator');
const Class = require('../models/class');
const auth = require('../middleware/auth');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');

const router = express.Router();


router.post(
    '/addclass',
    [
        auth,
        body('classroom_name').trim().not().isEmpty(),
        body('name').trim().not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);


        const { classroom_name, name } = req.body;

        try {
            const result = await Class.add({
                name, 
                classroom_name
            })

            res.status(201).json({ message: 'Class added'});

        } catch (err) {
            console.error('Can\'t add class:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
          }
    }
);


router.delete(
    '/deleteclass',
    [
      auth,
      query('class_id').notEmpty().withMessage('Class ID is required.'),
    ],
    async (req, res) => {    
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { class_id } = req.query;
  
      try {
        await Class.deleteByClassId(class_id);
  
        res.status(200).json({ message: 'Class deleted' });

      } catch (err) {
        console.error('Can\'t delete class:', err);
        return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
      }
    }
);


router.get(
    '/findclasses',
    [
      auth,
      query('classroom_name').notEmpty().withMessage('Classroom name is required.'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { classroom_name } = req.query;
      
      try{
        const result = await Class.findByClassroomName(classroom_name);
    
        res.status(200).json({ message: 'Classes found', classes: result.rows });

      } catch (err) {
            console.error('Can\'t find classes:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
      }
    }
);

router.get(
    '/findclass',
    [
      auth,
      query('class_id').notEmpty().withMessage('Class ID is required.'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { class_id } = req.query;
      
      try {
      const result = await Class.findByClassId(class_id);

      res.status(200).json({ message: 'Class found', class: result.rows[0] });
      }
      catch (err){
        console.error('Can\'t find class:', err);
        return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

module.exports = router;
