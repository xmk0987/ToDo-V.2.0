const express = require('express');

const { body, validationResult, query } = require('express-validator');
const auth = require('../middleware/studentauth');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');
const StudentAnswer = require('../models/studentAnswers');

const router = express.Router();

router.get(
    '/getstudentanswer',
    [
        query("todo_id").notEmpty().withMessage("Todo id is required."),
        query("username").notEmpty().withMessage("Todo id is required.")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { todo_id, username } = req.query;

        try {
            const result = await StudentAnswer.getAnswer(todo_id, username);
            if (result.rows.length === 0) {
                res.status(200).json(result.rows);
            } else {
                res.status(200).json(result.rows[0]);
            }
        } catch (err) {
            console.error('Can\'t get student answer:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.post(
    "/addstudentanswer",
    [
        auth,
        body('todo_id').trim().not().isEmpty(),
        body('answer').trim().not().isEmpty(),
        body('username').trim().not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);
    
        const { todo_id, answer, username } = req.body;

        try {
            await StudentAnswer.addAnswer(todo_id, answer, username);

            res.status(201).json({ message: 'Student answer added!' });
        } catch(err) {
            console.error('Can\'t add answer: ', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.delete(
    '/deletestudentanswer',
    [
        auth,
        query("todo_id").notEmpty().withMessage("Todo id is required."),
        query("username").notEmpty().withMessage("Username is required!")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { todo_id, username } = req.query;

        try {
            await StudentAnswer.deleteAnswer(todo_id, username);
            res.status(200).json({ message: "Answer deleted!"});

        } catch (err) {
            console.error('Can\'t delete student answer:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.put(
    '/updatestudentanswer',
    [
        auth,
        body('todo_id').trim().not().isEmpty(),
        body('answer').trim(),
        body('username').trim().not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
    
        handleValidationErrors(res, errors);
    
        const { todo_id, answer, username } = req.body;
    
        try {
            if(answer === '') {
                await StudentAnswer.deleteAnswer(todo_id, username);
                res.status(200).json({ message: 'Answer deleted' });

            } else {
                await StudentAnswer.updateAnswer(todo_id, answer, username);
                res.status(200).json({ message: 'Answer updated' });
            }

        } catch (err) {
            console.error('Can\'t update answer:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
      }
);

module.exports = router;