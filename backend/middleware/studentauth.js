const jwt = require('jsonwebtoken');
const {sendErrorResponse }= require('../middleware/sendErrorResponse');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return sendErrorResponse(res, 401, 'error', 'Not authenticated!');
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;


  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return sendErrorResponse(res, 500, 'error', err.message || 'Internal Server Error');
  }

  if (!decodedToken) {
    return sendErrorResponse(res, 401, 'error', 'Not authenticated!');
  }

  req.isLoggedIn = true;
  req.userId = decodedToken.userId;
  req.email = decodedToken.email;
  req.admin = decodedToken.admin;

  next();
};