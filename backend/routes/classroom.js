const express = require('express');

const { body, validationResult, query } = require('express-validator');
const Classroom = require('../models/classroom');
const auth = require('../middleware/auth');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');

const router = express.Router();


router.post(
    '/addclassroom',
    [
      auth,
      body('username').trim().not().isEmpty(),
      body('classroom_name').trim().not().isEmpty(),
    ],
    async (req, res) => {    
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { username, classroom_name } = req.body;
  
      try {
        await Classroom.add(
          username,
          classroom_name,
        );
  
        res.status(201).json({ message: 'Classroom added' });

      } catch (err) {
        if(err.code === '23505') {
            return sendErrorResponse(res, 409, 'duplicateError', 'The classroom name is already in use.');

        }
        return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
      }
    }
);

router.delete(
    '/deleteclassroom',
    [
      auth,
      body('classroom_name').trim().not().isEmpty(),
    ],
    async (req, res) => {    
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { classroom_name } = req.body;
  
      try {
        await Classroom.deleteByClassroomName(
          classroom_name,
        );
  
        res.status(200).json({ message: 'Classroom deleted' });

      } catch (err) {
        console.error('Can\'t delete classroom:', err);
        return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
      }
    }
);

router.get(
    '/findClassrooms',
    [
      auth,
      query('username').notEmpty().withMessage('Username is required.'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { username } = req.query;
      
      try{
        const result = await Classroom.findByUserName(username);
    
        res.status(200).json({ message: 'Classrooms found', classrooms: result.rows });
      }
      catch (err) {
        console.error('Can\'t find classrooms:', err);
        return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
      }
    }
);
  

router.get(
    '/findClassroom',
    [
      query('classroom_name').notEmpty().withMessage('Classroom name is required.'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      handleValidationErrors(res, errors);
  
      const { classroom_name } = req.query;
      
      try{
        const result = await Classroom.findByClassroomName(classroom_name);
    
        res.status(200).json({ message: 'Classroom found', classroom: result.rows });
      }
      catch (err) {
        console.error('Can\'t find classroom:', err);
        return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
      }
    }
);

router.get(
  '/findactive',
  [
    auth,
    query('username').notEmpty().withMessage('Username is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    handleValidationErrors(res, errors);

    const { username } = req.query;

    try{
      const result = await Classroom.findActive(username);
  
      res.status(200).json({ message: 'Classroom found', classroom: result.rows });
    }
    catch (err) {
      console.error('Can\'t find classroom:', err);
      return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
    }
  }
);


router.put(
  '/setactiveclassroom',
  [
    auth,
    body('username').trim().not().isEmpty(),
    body('classroom_name').trim().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    handleValidationErrors(res, errors);

    const { username, classroom_name } = req.body;

    try {
      await Classroom.setActive(username, classroom_name);

      res.status(200).json({ message: 'Classroom set active' });
    } catch (err) {
      console.error('Can\'t set classroom active:', err);
      return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
    }
  }
);


router.put(
  '/setsharedclass',
  [
    auth, 
    body('class_id'),
    body('classroom_name').trim().not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    handleValidationErrors(res, errors);

    const {class_id, classroom_name} = req.body;

    try {
      await Classroom.setOnShare(classroom_name, class_id);
      res.status(200).json({ message: 'Class set on share' });
    } 
    catch (err) {
      console.error('Can\'t set class on share:', err);
      return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
    }
  }
);

router.get(
  '/getsharedclass',
  [
    auth,
    query('classroom_name').notEmpty().withMessage('Classroom name is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    handleValidationErrors(res, errors);

    const { classroom_name } = req.query;

    try {
      const result = await Classroom.getSharedClass(classroom_name);
      if( result.rows.length === 0) {
        res.status(404).json({ message: "No class set on share! "});
      } else {
        res.status(200).json({ shared_id : result.rows[0].shared_id});
      }
    } 
    catch (err) {
      console.error('Can\'t get shared class:', err);
      return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
    }

  }
)

module.exports = router;