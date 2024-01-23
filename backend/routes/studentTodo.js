const express = require('express');

const { body, validationResult, query } = require('express-validator');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');

const StudentTodo = require('../models/studentTodo');
const auth = require('../middleware/studentauth');

const router = express.Router();

router.get(
    '/getstudenttodos',
    [
        auth,
        query("username").notEmpty().withMessage('Username is required.'),
        query("class_id").notEmpty().withMessage('Class id is required.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { username, class_id } = req.query;

        try {
            const result = await StudentTodo.findStudentTodos(class_id, username);

            res.status(200).json(result);

        } catch (err) {
            console.error('Can\'t get students todos:', err);
            if (err.code === '23503') {
                return sendErrorResponse(res, 404, 'notFound', "Username not found");
            }
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.put(
    '/updatestudenttodo',
    [
        auth,
        body('student_todo_id').trim().not().isEmpty(),
        body('updates')
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);

        const {student_todo_id, updates} = req.body;

        try {
            await StudentTodo.updateCompleted(student_todo_id, updates);
            res.status(200).json( {message: 'Todos updated'} );

        } catch (err) {
            console.error('Can\'t update todos:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
)

module.exports = router;