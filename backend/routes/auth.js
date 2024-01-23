const express = require('express');
const { body,query, validationResult } = require('express-validator');
const {sendErrorResponse, handleValidationErrors }= require('../middleware/sendErrorResponse');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');


router.post(
  '/signup',
  [
    body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 422, 'validationErrors', errors.array());
    }

    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const existingEmail = await User.findEmail(email);
      const existingUsername = await User.findUsername(username);

      if (existingEmail.rows.length > 0) {
        return sendErrorResponse(res, 422, 'emailExists', 'The provided email is already in use.');
      }

      if (existingUsername.rows.length > 0) {
        return sendErrorResponse(res, 422, 'usernameExists', 'The provided username is already in use.');
      }

      const userDetails = {
        username: username,
        email: email,
        password: hashedPassword,
      };

      const result = await User.save(userDetails);

      if (result.rowCount === 1) {
        return res.status(201).json({ message: 'User registered!' });
      } else {
        return sendErrorResponse(res, 500, 'registrationFailed', 'Failed to register user.');
      }
    } 
    catch (err) {
      console.error('Signup error:', err);
      return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
    }
  }
);

router.post('/login', async (req, res) => {
  try {
    let user;

    const loginName = req.body.loginName;
    const password = req.body.password;

    // Check if loginName is in email format
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginName);

    if (isEmail) {
      user = await User.findEmail(loginName);
    } else {
      user = await User.findUsername(loginName);
    }

    if (user.rows.length !== 1) {
      return sendErrorResponse(res, 404, 'userNotFound', 'A user with this email or username could not be found.');
    }

    const storedUser = user.rows[0];

    const isEqual = await bcrypt.compare(password, storedUser.password);

    if (!isEqual) {
      return sendErrorResponse(res, 401, 'wrongPassword', 'Wrong password!');
    }

    const token = jwt.sign(
      {
        email: storedUser.email,
        username: storedUser.username,
        userId: storedUser.user_id,
        admin: true,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1w' }
    );

    return res.status(200).json({ token: token, userId: storedUser.user_id, username: storedUser.username, admin: true, message: 'User logged in.' });
  } 
  catch (error) {
    console.error('Login error:', error);
    return sendErrorResponse(res, 500, 'internalServerError', 'Failed to login user.');
  }
});


router.delete(
  '/deleteuser',
  [
    auth,
    query('username').notEmpty().withMessage('Username is required.')
  ],
  async (req, res) => {    
    const errors = validationResult(req);

    handleValidationErrors(res, errors);

    const { username } = req.query;

    try {
      await User.deleteUser(
        username,
      );

      res.status(200).json({ message: 'User deleted' });

    } catch (err) {
      console.error('Can\'t delete user:', err);
      return sendErrorResponse(res, 500, 'internalServerError', 'An unexpected error occurred.');
    }
  }
)

module.exports = router;