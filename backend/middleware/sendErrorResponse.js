
// Helper function for consistent error response
const handleValidationErrors = (res, errors) => {
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, 'validationError', 'Validation failed', errors.array());
  }
};


const sendErrorResponse = (res, status, errorKey, errorMessage) => {
  console.log("Tullaa tä nne ");
  console.log(errorMessage);
    return res.status(status).json({
      error: {
        [errorKey]: errorMessage,
      },
      message: errorMessage,
    });
  };
  
module.exports = {sendErrorResponse, handleValidationErrors};