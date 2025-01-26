const { JWT_SECRET } = require("../config");
const jsonwebtoken = require("jsonwebtoken"); 
const  zod  = require("zod"); 
const express = require('express');
const router = express.Router();
const User = require("../db"); 

const authMiddleware = (req, res, next) => { 
    const authHeader = req.headers.authorization; 

    req.userId=

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(' ')[1]; 
    try {
        const decoded = jsonwebtoken.verify(token, JWT_SECRET); // Fixed variable name
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

const updateBody = zod.object({
    password: zod.string().optional(), 
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => { // Fixed incorrect './' to '/'
    const { success } = updateBody.safeParse(req.body); // Fixed incorrect '.'
    if (!success) {
        return res.status(411).json({
            message: "Error updating info"
        });
    }
    await User.updateOne({ _id: req.userId }, req.body); // Fixed method name casing

    res.json({ // Fixed response object syntax
        message: "Updated successfully"
    });
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || ""; // Removed duplicate declaration
    // Gets the filter query parameter from the URL (e.g., ?filter=John). If not provided, it defaults to an empty string.

    const users = await User.find({
        $or: [
            { firstName: { "$regex": filter, "$options": "i" } },
            { lastName: { "$regex": filter, "$options": "i" } }
        ]
    });

    res.json({
        users: users.map(user => ({ 
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = {
    authMiddleware 
};


// const { JWT_SECRET } = require("./config");

// Imports the secret key for JWT verification from the config file.
// const jwt = require("jsonwebtoken");

// Imports the jsonwebtoken package to handle JWT operations.
// const authMiddleware = (req, res, next) => {

// Defines an Express.js middleware function for authentication.
// const authHeader = req.headers.authorization;

// Extracts the Authorization header from the incoming request.
// if (!authHeader || !authHeader.startsWith('Bearer ')) {

// Checks if the header is missing or improperly formatted.
// return res.status(403).json({});

// Sends a 403 Forbidden response if the token is missing/invalid.
// const token = authHeader.split(' ')[1];

// Extracts the actual token by splitting the Bearer <token> string.
// try {

// Starts a block to handle token verification.
// const decoded = jwt.verify(token, JWT_SECRET);

// Verifies the token using the secret key and decodes it.
// req.userId = decoded.userId;

// Attaches the userId from the token payload to the request object.
// next();
// Passes control to the next middleware function in the chain.
// } catch (err) {
// Catches any errors if the token verification fails.
// return res.status(403).json({});
// Sends a 403 Forbidden response if token verification fails.
// };
// Closes the middleware function.
// module.exports = { authMiddleware };
// Exports the middleware function for use in other parts of the app.
// Let me know if you need further details!




// A Bearer Token is like a digital key that proves who you are when using a website or app.

// How it works:

// You log in and get a token (a long string of letters and numbers).
// Every time you request something (like viewing your profile), you send the token with your request.
// The server checks the token to see if it's valid and lets you access the data if it is.
// Why it's useful:

// You don't have to log in again and again.
// It's a safe way to prove your identity without sharing your password every time.
// It's commonly used in apps like banking, shopping, and social media.
// Let me know if that makes sense!