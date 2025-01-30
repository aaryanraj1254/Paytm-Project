const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://aaryan:db_9896@cluster0.rvgo4.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("MongoDB connection error: ", err));


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 30,
        trim: true,
        lowercase: true, 
    },
    password: {
        type: String,
        required: true,
        minLength: 6, 
    },
    firstName: {
        type: String,
        required: true,
        minLength: 6, 
        maxLength: 50, 
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 6, 
        maxLength: 50, 
    }
});


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the 'User' model
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
});


const Account = mongoose.model('Account', accountSchema);


const User = mongoose.model('User', userSchema);


module.exports = {
    User, 
    Account, 
};
