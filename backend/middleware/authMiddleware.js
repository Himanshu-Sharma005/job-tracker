// const jwt = require('jsonwebtoken');

// const protect = (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = { id: decoded.id };
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// module.exports = { protect };

// Import the jsonwebtoken library to create and verify secure tokens
const jwt = require("jsonwebtoken");

// Create a function called protect to check if a user is logged in before letting them visit a page
const protect = (req, res, next) => {
  // Create an empty variable named token to store the user's login key later
  let token;

  // Check if the request contains an Authorization header and if it starts with the word 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Start a try block to run code that might throw an error if the token is fake or expired
    try {
      // Split the header text by the space character and take the second part which is the actual token string
      token = req.headers.authorization.split(" ")[1];
      // Decode and verify the token using our secret key to make sure it is genuine
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Extract the user ID from the verified token data and attach it to the request object
      req.user = { id: decoded.id };
      // Everything is perfect, so call next() to let the user move on to the actual page or route
      next();
      // If the token verification fails or any error occurs, jump into this catch block
    } catch (error) {
      // Send a 401 Unauthorized status code back along with an error message saying the token failed
      res.status(401).json({ message: "Not authorized, token failed" });
      // Close the try-catch block
    }
    // If the Authorization header is completely missing or formatted incorrectly, run this block
  } else {
    // Send a 401 Unauthorized status code back along with a message saying no token was provided
    res.status(401).json({ message: "Not authorized, no token" });
    // Close the main if-else check
  }
  // Close the protect function block
};

// Export the protect function so that other routing files in your project can use it as middleware
module.exports = { protect };
