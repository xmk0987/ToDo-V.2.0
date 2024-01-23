const express = require('express');

const { body, validationResult, query } = require('express-validator');
const Todo = require('../models/todo');
const auth = require('../middleware/auth');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');

const router = express.Router();

router.post(
    '/addtodo',
    [
        auth,
        body('class_id').trim().not().isEmpty(),
        body('content').trim().not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);

        const { class_id, content } = req.body;

        try {
            await Todo.add(class_id, content);

            res.status(201).json({ message: 'Todo added' });

        } catch(err) {
            console.error('Can\'t add todo:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.get(
    '/gettodos',
    [
        auth, 
        query('class_id').notEmpty().withMessage('Class ID is required.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);

        const { class_id } = req.query;

        try {
            const result = await Todo.findClassTodos(class_id);

            res.status(200).json( {message: 'Todos retrieved', todos: result.rows} )
        } catch (err) {
            console.error('Can\'t get todos:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.put(
    '/updatetodo',
    [
        auth,
        body('todo_id').trim().not().isEmpty(),
        body('updates')
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);

        const {todo_id, updates} = req.body;

        try {
            await Todo.update(todo_id, updates);

            res.status(200).json( {message: 'Todos updated'} )
        } catch (err) {
            console.error('Can\'t update todos:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.delete(
    "/deletetodo",
    [
        auth,
        query('todo_id').notEmpty().withMessage('Class ID is required.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);

        const { todo_id } = req.query;
        try{
            await Todo.delete(todo_id);
    
            res.status(200).json({ message: 'Todo removed'});
    
        } catch (err) {
            console.error('Can\'t delete todo:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
)

router.put(
    "/swapposition",
    [
        auth,
        body('todo').notEmpty().withMessage('Need a todo'),
        body('todo2').notEmpty().withMessage('Need a index'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);

        const { todo, todo2 } = req.body;

        try {
            await Todo.swapPosition(todo, todo2);

            res.status(201).json({ message: 'Swap successful' });
        } catch (err) {
            console.error('Can\'t swap todo positions:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
)


module.exports = router;