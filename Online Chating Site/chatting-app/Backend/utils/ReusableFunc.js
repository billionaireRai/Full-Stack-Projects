// async function to handle try-catch ...
const asyncErrorHandler = (Function) => {
    return (req,res,next) => { 
        Function(req,res,next).catch((err) => { next(err) }) ;
     }
} 

// function to send structured, successful responses to the client.
const apiGeneralResponse = (res, data, message = "Success", statusCode = 200) => {
    console.log("Positive API response :",message,statusCode) ;
    res.status(statusCode).json({ message : message , Data : data });
};

// function for sending error responses back to the client in a consistent format...
const apiGeneralError = (res, error, message = "An error occurred", statusCode = 500) => {
    res.status(statusCode).json({ status: "error", message, error: error.message || error });
};


module.exports = { asyncErrorHandler , apiGeneralError , apiGeneralResponse } ;