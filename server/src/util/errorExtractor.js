function extractErrorDetails(error) {
    let errorDetails = error.message;
  
    if (error.response && error.response.data && error.response.data.error) {
      errorDetails = error.response.data.error;
    }
  
    return errorDetails;
  }

module.exports = {
    extractErrorDetails,
};