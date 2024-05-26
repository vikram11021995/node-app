// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use((req,res,next)=>{
    console.log("API Called : ",req);
    next()
})

// Routes
app.use('/api/user', userRoutes);
// app.use('/api/post', userRoutes);

// Error middleware
// app.use((req,res,next)=>{
//     console.log(err);
//     let status=500;
//     if(err.status==410){status=err.status};
//     return res.status(status).json({"message":"Error Occured",error: error})
// })



// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
