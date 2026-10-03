// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// const signupUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Please add all fields', data: null });
//     }

//     const userExists = await User.findByEmail(email);
//     if (userExists) {
//       return res.status(400).json({ success: false, message: 'User already exists', data: null });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const result = await User.create(name, email, hashedPassword);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         _id: result.insertId,
//         name,
//         email,
//         token: generateToken(result.insertId)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findByEmail(email);

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         success: true,
//         message: 'Logged in successfully',
//         data: {
//           _id: user.id,
//           name: user.name,
//           email: user.email,
//           token: generateToken(user.id)
//         }
//       });
//     } else {
//       res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const getMe = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found', data: null });
//     }

//     res.json({
//       success: true,
//       message: 'User retrieved successfully',
//       data: {
//         id: user.id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   signupUser,
//   loginUser,
//   getMe
// };

// Import the User model file to interact with the users table in our database
const User = require("../models/User");
// Import the bcrypt library to securely hash and compare user passwords
const bcrypt = require("bcrypt");
// Import the jsonwebtoken library to generate secure login tokens
const jwt = require("jsonwebtoken");

// Create a helper function named generateToken that takes a user's ID
const generateToken = (id) => {
  // Use jwt.sign to pack the ID into a secure token, sign it with our secret key, and set it to expire in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  // Close the generateToken function
};

// Create an asynchronous function to handle registering a brand new user
const signupUser = async (req, res, next) => {
  // Start a try block to safely run code that might run into errors
  try {
    // Extract the name, email, and password properties sent by the user inside the request body
    const { name, email, password } = req.body;

    // Check if any of the required fields (name, email, or password) are missing
    if (!name || !email || !password) {
      // Send a 400 Bad Request status code and a JSON message telling the user to fill out all fields
      return res
        .status(400)
        .json({ success: false, message: "Please add all fields", data: null });
      // Close the missing fields check
    }

    // Query the database to see if a user with this specific email already exists
    const userExists = await User.findByEmail(email);
    // If a user with that email is found in the database
    if (userExists) {
      // Send a 400 Bad Request status code and a JSON message stating that the user already exists
      return res
        .status(400)
        .json({ success: false, message: "User already exists", data: null });
      // Close the user existence check
    }

    // Generate a random security salt string with a strength factor of 10 for password hashing
    const salt = await bcrypt.genSalt(10);
    // Mix the plain text password with the generated salt to create a secure, scrambled password hash
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user into the database with their name, email, and the scrambled password hash
    const result = await User.create(name, email, hashedPassword);

    // Send a 201 Created status code back to indicate successful registration
    res.status(201).json({
      // Set the success indicator to true
      success: true,
      // Provide a friendly success text message
      message: "User registered successfully",
      // Include an inner data object containing the new user's public info and token
      data: {
        // Provide the unique ID generated by the database for this new row
        _id: result.insertId,
        // Send back the registered name
        name,
        // Send back the registered email
        email,
        // Generate and send a login token for this new user using their new database ID
        token: generateToken(result.insertId),
        // Close the inner data object
      },
      // Close the JSON response block
    });
    // If anything fails during the signup process, jump straight into this catch block
  } catch (error) {
    // Pass the error over to our global error handling middleware using the next function
    next(error);
    // Close the try-catch block
  }
  // Close the signupUser function block
};

// Create an asynchronous function to log in an existing user
const loginUser = async (req, res, next) => {
  // Start a try block to safely capture any unexpected code execution errors
  try {
    // Extract the email and password variables from the incoming request body data
    const { email, password } = req.body;

    // Query the database to look up the user record corresponding to the provided email
    const user = await User.findByEmail(email);

    // Check if the user exists and if the provided password matches the scrambled password hash stored in the database
    if (user && (await bcrypt.compare(password, user.password))) {
      // Send a successful JSON response back to the client
      res.json({
        // Set the success flag to true
        success: true,
        // Provide a friendly success text message
        message: "Logged in successfully",
        // Include an inner data object containing the logged-in user's public information
        data: {
          // Provide the user's unique database ID
          _id: user.id,
          // Provide the user's name
          name: user.name,
          // Provide the user's email address
          email: user.email,
          // Generate a fresh login token using the user's database ID and include it in the response
          token: generateToken(user.id),
          // Close the inner data object
        },
        // Close the JSON response block
      });
      // If the user wasn't found or the password did not match the hashed password
    } else {
      // Send a 401 Unauthorized status code along with a JSON message stating the login credentials are invalid
      res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: null });
      // Close the credentials verification check
    }
    // If anything goes wrong during login processing, jump directly to this catch block
  } catch (error) {
    // Forward the error payload over to the application's centralized error handler middleware
    next(error);
    // Close the try-catch block
  }
  // Close the loginUser function block
};

// Create an asynchronous function to fetch the profile details of the currently logged-in user
const getMe = async (req, res, next) => {
  // Start a try block to shield the app from crashing if any internal failures occur
  try {
    // Query the database to find the user profile using the ID attached to the request by the protect middleware
    const user = await User.findById(req.user.id);
    // Check if the database query returned absolutely no user record for that ID
    if (!user) {
      // Send a 404 Not Found status code and a JSON response stating the user profile was not found
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
      // Close the profile existence validation check
    }

    // Respond back to the frontend with a successful JSON payload
    res.json({
      // Set the success flag to true
      success: true,
      // Provide a clear profile retrieval success message
      message: "User retrieved successfully",
      // Include an inner data object containing the safe, non-sensitive user profile attributes
      data: {
        // Return the user's profile database ID
        id: user.id,
        // Return the user's profile name
        name: user.name,
        // Return the user's profile email address
        email: user.email,
        // Close the inner data object
      },
      // Close the JSON response block
    });
    // If an error pops up while gathering profile data, hand it off to this catch block
  } catch (error) {
    // Push the error over to the centralized error middleware to be safely formatted and displayed
    next(error);
    // Close the try-catch block
  }
  // Close the getMe function block
};

// Export these authentication functions as an object so they can be tied directly to API routing files
module.exports = {
  // Include the signupUser function in the export object
  signupUser,
  // Include the loginUser function in the export object
  loginUser,
  // Include the getMe function in the export object
  getMe,
  // Close the module exports object
};
