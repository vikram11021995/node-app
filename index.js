// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use((req,res,next)=>{
    console.log("API Called : ",req);
    next()
})


// Custom middleware to log request details
// const requestLogger = (req, res, next) => {
//     const now = new Date();
//     const logEntry = `[${now.toISOString()}] ${req.method} ${req.url}\n`;
//     console.log("log : ",logEntry);
//     fs.appendFile(path.join(__dirname+"/logs", 'access.log'), logEntry, (err) => {
//         if (err) {
//           console.error('Failed to write log entry:', err);
//         }
//       });
//     next(); // Call the next middleware function in the stack
// };
  
// Use the custom middleware globally
// app.use(requestLogger);

//Using morgan library for logging
// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname+"/logs", 'access.log'), { flags: 'a' });
// Setup morgan to log to the file
app.use(morgan('combined', { stream: accessLogStream }));

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
