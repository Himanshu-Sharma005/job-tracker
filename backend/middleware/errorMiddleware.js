// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || 'Server Error',
//     data: null,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack
//   });
// };

// module.exports = {
//   errorHandler
// };

// Create a function called errorHandler to catch and manage any errors that happen in our application
const errorHandler = (err, req, res, next) => {
  // If a specific error status code is already set on the response, use it, otherwise default to a 500 Server Error code
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Send the error response back to the user with the determined status code using a clean JSON format
  res.status(statusCode).json({
    // Set a success flag to false so the frontend easily knows that something went wrong
    success: false,
    // Provide the actual error message text, or use the fallback text 'Server Error' if no message exists
    message: err.message || "Server Error",
    // Set the data field to null because no successful data can be returned during an error
    data: null,
    // If the app is live in production, hide the technical error stack trace for safety, otherwise show it for debugging
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    // Close the JSON object and the response statement
  });
  // Close the errorHandler function block
};

// Export the errorHandler function in an object so that your main server file can use it as a global error middleware
module.exports = {
  // Include the errorHandler function inside the exported object
  errorHandler,
  // Close the export block
};
