const express = require("express"); // Import express framework
const userRouter = require("./user"); // Import user router
const accountRouter = require("./account"); // Import account router
const zod = require('zod'); // Import zod for validation
const { User } = require("../db"); // Assuming User is the model from the db
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
const { JWT_SECRET } = require("../config");
 // Secret key for JWT

const router=express.Router();
// Define schema for signup validation using zod
const signupBody = zod.object({
    username: zod.string().email(), // Validate username as email
    firstname: zod.string(), // Validate firstname
    lastname: zod.string(), // Validate lastname
    password: zod.string(), // Validate password
});

// POST route for signup
router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body); // Validate request body against signup schema
    if (!success) {
        return res.status(411).json({
            message: "Invalid email/email already in use",
        });
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect Inputs",
        });
    }

    // Create a new user in the database
    const user = await User.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
    });

    // Create a signed token using userId and the JWT secret key
    const userId = user.id;

    // Create an account with a random balance
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000,
    });

    // Generate JWT token
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token, // Send the token back in the response
    });
});

// Define schema for signin validation using zod
const signInBody = zod.object({
    username: zod.string().email(), // Validate username as email
    password: zod.string(), // Validate password
});

// POST route for signin
router.post("/signin", async (req, res) => {
    const { success } = signInBody.safeParse(req.body); // Validate request body against signin schema
    if (!success) {
        return res.status(411).json({
            message: "Incorrect input",
        });
    }

    // Find the user by username (you can add password check here later)
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(411).json({
            message: "Error while logging in",
        });
    }

    // Generate JWT token after successful login
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
        message: "Logged in successfully",
        token: token, // Send the token back in the response
    });
});

const cors = require('cors');
const app = express(); // Create an express app instance

// Use middleware to enable CORS and parse incoming JSON requests
app.use(cors());
app.use(express.json());

// Create an express router instance to define and handle routes

// router.use("./user"); // Use the user router
router.use("/account",accountRouter); // Use the account router

// Mount the router under the /api/v1 path, making all user-related routes accessible under /api/v1/user
app.use("/api/v1", router);

// Start the server on port 3000
// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

// Export the router for use in other parts of the application
module.exports = router;


//exports the router object so it can be used in index.js















// CORS allows your frontend (different website) to communicate with the backend.
// Without it, browsers will block the request for security.
// Adding cors middleware in Express solves this issue.
