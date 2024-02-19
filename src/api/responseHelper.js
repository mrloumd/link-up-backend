// STATUS: 0 err, 1 success
// MESSAGE: '' will have value of success,
// ERRORS: [] parameter should be array of values

// responseHelper.js

const dataResponse = (statusCode, message = "", errors = [], data = null) => {
  return {
    statusCode,
    message,
    errors,
    ...data,
  };
};

const sendResponse = (res, statusCode, message, errors, data) => {
  const response = dataResponse(statusCode, message, errors, data);
  res.status(statusCode).json(response);
};

export { sendResponse };
