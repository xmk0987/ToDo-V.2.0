const express = require('express');

const auth = require('../middleware/auth');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');
const { body, validationResult, query } = require('express-validator');

const Answer = require('../models/answers');
const Todo = require('../models/todo');

const router = express.Router();

router.get(
    '/getanswer',
    [
        query("todo_id").notEmpty().withMessage("Todo id is required.")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { todo_id } = req.query;

        try {
            const result = await Answer.getAnswer(todo_id);
            if (result.rows.length === 0) {
                res.status(200).json(result.rows);
            } else {
                res.status(200).json(result.rows[0]);
            }

        } catch (err) {
            console.error('Can\'t get answer:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.post(
    "/addanswer",
    [
        auth,
        body('todo_id').trim().not().isEmpty(),
        body('answer').trim().not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);
    
        const { todo_id, answer } = req.body;

        try {
            await Todo.setQuestion(todo_id);
            await Answer.addAnswer(todo_id, answer);

            res.status(201).json({ message: 'Answer added!' });
        } catch(err) {
            console.error('Can\'t add answer: ', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.delete(
    '/deleteanswer',
    [
        auth,
        query("todo_id").notEmpty().withMessage("Todo id is required.")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { todo_id } = req.query;

        try {
            await Todo.setQuestion(todo_id);
            await Answer.deleteAnswer(todo_id);
            res.status(200).json({ message: "Answer deleted!"});

        } catch (err) {
            console.error('Can\'t delete answer:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.put(
    '/updateanswer',
    [
        auth,
        body('todo_id').trim().not().isEmpty(),
        body('answer').trim(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
    
        handleValidationErrors(res, errors);
    
        const { todo_id, answer } = req.body;
    
        try {
            await Answer.updateAnswer(todo_id, answer);
            res.status(200).json({ message: 'Answer updated' });

        } catch (err) {
            console.error('Can\'t update answer:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
      }
);

module.exports = router;