const express=require('express');
const mongoose = require('mongoose'); 
const {authMiddleware}=require('./middleware.js');
const {Account}=require('../db');
const router=express.Router();

router.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    });
    res.json({
        balance:account.balance 
    });
});

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount,to}=req.body;

    const account=await Account.findOne({userId:req.userId}).session(session); 

    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient balance"
        });
    }
    const toAccount=await Account.findOne({userId:to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account" // Fixed typo from "Inavalid" to "Invalid"
        });
    }
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);

    await session.commitTransaction();
    res.json({
        message:"Transfer successful"
    });
});

module.exports=router;












// router.post("/transfer", authMiddleware, async (req, res) => {

// Defines a POST route for /transfer, applying authMiddleware to authenticate the user before handling the request.
// const session = await mongoose.startSession();

// Starts a new Mongoose session to support database transactions.
// session.startTransaction();

// Begins a transaction to ensure atomicity (all operations succeed or fail together).
// const { amount, to } = req.body;

// Extracts the amount and to (recipient user ID) from the request body.
// const account = await Account.findOne({ userId: req.userId }).session(session);

// Finds the sender's account using their user ID within the active transaction session.
// if (!account || account.balance < amount) {

// Checks if the sender's account exists and has enough balance for the transfer.
// await session.abortTransaction();

// Aborts the transaction if balance is insufficient.
// return res.status(400).json({ message: "Insufficient balance" });

// Returns an error response if the balance is insufficient.
// const toAccount = await Account.findOne({ userId: to }).session(session);

// Finds the recipient's account using the provided user ID within the session.
// if (!toAccount) {

// Checks if the recipient's account exists.
// await session.abortTransaction();

// Aborts the transaction if the recipient's account is not found.
// return res.status(400).json({ message: "Invalid account" });

// Returns an error response if the recipient's account is invalid.
// await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);

// Deducts the transfer amount from the sender's balance.
// await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

// Adds the transfer amount to the recipient's balance.
// await session.commitTransaction();

// Commits the transaction to finalize the changes.
// res.json({ message: "Transfer successful" });

// Sends a success response after a successful transfer.
// });

// Closes the route handler function.
// module.exports = router;

// Exports the router to be used in other parts of the application.





// Previous Code (API Route):

// The transfer happens when a user sends a request to the server (like clicking a button on a website).
// The server handles one request at a time in order, reducing the chance of mistakes.
// Current Code (Direct Function Calls):

// The transfer happens automatically when the code runs.
// Since the function is called twice almost at the same time, both might check the balance before updating it, which can cause problems like spending the same money twice.
// Simple Example:
// Imagine you have ₹100 in your wallet.

// In the previous code, you go to a shop and buy items one by one. The shopkeeper checks your wallet before each purchase.
// In the current code, two people (like two shopkeepers) check your wallet at the same time and both think you have ₹100, so you might end up spending ₹200 by mistake.






// You said:
// n the current code, two people (like two shopkeepers) check your wallet at the same time and both think you have ₹100, so you might end up spending ₹200 by mistake.
// ChatGPT said:
// ChatGPT
// Yes, exactly! In the current code, since the transfer function is called twice almost at the same time, both function calls might check the balance before any deduction happens.

// Each call sees ₹100 in the account and thinks there’s enough money, so both proceed with the transfer. As a result, ₹200 might be transferred even though there was only ₹100 available — leading to an overdraft or incorrect balance.

// This issue happens because the operations are happening concurrently (at the same time), and there's no proper locking or control to prevent double spending.

// In contrast, the previous code (API route) processes one request at a time, ensuring that once the money is deducted, the next transaction will see the updated balance.