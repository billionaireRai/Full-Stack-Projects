const jsonWebToken = require('jsonwebtoken') ;
const { apiGeneralError } = require('./ReusableFunc.js') ;

// global Error handling middleware...
const errorHandlingMiddleware = (error,res) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    console.log(`The error statusCode : ${error.statusCode} , error status : ${error.status}  & Text ${error.message}`);
    res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
}

// middleware for user (request) authenticating...
const checkUserAuthenticity = (req,res,next) => { 
    const { accessToken } = req.cookie ; // destructuring jwt from cookies...
    if(!accessToken) throw new apiGeneralError(res,"Unauthorized User!!","please register OR login to access this resource",401) ;
    // verify jwt token using secret key...
    const decodedToken = jsonWebToken.verify(accessToken,process.env.SECRET_KEY_FOR_ACCESSTOKEN) ; // decoding through jwt..
    req.user = decodedToken ; // assigning decoded token to req.user...
    next() ; // calling the next middleware...
} 


module.exports = { errorHandlingMiddleware ,checkUserAuthenticity } ;