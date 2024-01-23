const express = require('express');

const { body, validationResult, query } = require('express-validator');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');

const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const studentauth = require('../middleware/studentauth');

const Student = require('../models/students');
const Classroom = require('../models/classroom');

const router = express.Router();

router.post(
    "/studentlogin",
    [
        body('classroom_name').trim().not().isEmpty(),
        body('username').trim().not().isEmpty(),
    ],
    async (req,res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);
        
        try {
            let student;

            const {classroom_name, username} = req.body;

            const isClassroom = await Classroom.findByClassroomName(classroom_name);
            if(isClassroom.rows.length === 0) {
                return sendErrorResponse(res, 404, 'notFound', 'Classroom doesn\'t exists.');
            } else {
                const isStudent = await Student.getStudent(username);
                if (isStudent.rows.length === 0) {
                    await Student.addStudent(classroom_name, username);
                    const newStudent = await Student.getStudent(username);
                    student = newStudent.rows[0];
                } else {
                    if(isStudent.rows[0].classroom_name.toLowerCase() !== classroom_name.toLowerCase()) {
                        return sendErrorResponse(res, 409, 'duplicate', 'That username is taken already');
                    } else {
                        student = isStudent.rows[0];
                    }
                }

                const token = jwt.sign(
                    {
                        username: student.username,
                        classroom_name: student.classroom_name,
                        name: student.name,
                        admin: false
                    },
                    process.env.TOKEN_SECRET,
                    {expiresIn: '1w' }
                );
    
                res.status(201).json({token: token, username: student.username, classroom_name: student.classroom_name, admin: false, message: 'User logged in.'});
            }

        }  catch(err) {
            if(err.code === "23503") {
                return sendErrorResponse(res, 404, 'notFound', "Classroom not found");
            }
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
)

router.post(
    "/addstudent",
    [
        body('classroom_name').trim().not().isEmpty(),
        body('username').trim().not().isEmpty(),
        body('name').trim().not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
  
        handleValidationErrors(res, errors);
    
        const { classroom_name, username, name } = req.body;

        try {
            await Student.addStudent(
                classroom_name,
                username,
                name
            );

            res.status(201).json({ message: 'Student added!' });
        } catch(err) {
            console.error('Can\'t add student: ', err);

            if (err.code === "23505") {
                return sendErrorResponse(res, 404, 'duplicateError', "Username is taken");
            }
            else if(err.code === "23503") {
                return sendErrorResponse(res, 404, 'notFound', "Classroom not found");
            }
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.get(
    '/getclassroomstudents',
    [ 
        auth,
        query("classroom_name").notEmpty().withMessage('Classroom name is required.'),
    ], 
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { classroom_name } = req.query;

        try {
            const result = await Student.getClassroomStudents(classroom_name);
            if( result.rows.length === 0) {
                res.status(200).json(null);
              } else {
                res.status(200).json(result.rows);
              }
        } catch (err) {
            console.error('Can\'t get students:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);


router.get(
    '/getstudent',
    [
        studentauth,
        query("username").notEmpty().withMessage("Username is required.")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { username } = req.query;

        try {
            const result = await Student.getStudent(username);
            if( result.rows.length === 0) {
                res.status(404).json({ message: "Student not found!"});
              } else {
                res.status(200).json(result.rows[0]);
              }
        } catch (err) {
            console.error('Can\'t get student:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.delete(
    '/deletestudent',
    [
        auth,
        query("username").notEmpty().withMessage("Username is required.")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        handleValidationErrors(res, errors);
    
        const { username } = req.query;

        try {
            await Student.removeStudent(username);
            res.status(200).json({ message: "Student deleted!"});

        } catch (err) {
            console.error('Can\'t delete student:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
    }
);

router.put(
    '/setstudentname',
    [
        auth,
        body('username').trim().not().isEmpty(),
        body('name').trim().not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
    
        handleValidationErrors(res, errors);
    
        const { username, name } = req.body;
    
        try {
          await Student.setName(username, name);
    
          res.status(200).json({ message: 'Name set' });
        } catch (err) {
            console.error('Can\'t set name:', err);
            return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
        }
      }
);

module.exports = router;