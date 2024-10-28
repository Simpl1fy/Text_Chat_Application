const jwt = require('jsonwebtoken');


// function to verify jwt token
const jwtAuthMiddleware = (req, res, next) => {

    // check whether there is a authorization token in header
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({"Error": "No Token Found"});
    
    // extract the json token from the header
    const token = authorization.split(' ')[1];
    if (!token ) return res.status(401).json({"Error": "Invalid Token"});

    // now verifying the token
    try {
        // verifying the user token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // saving the new token in the request
        req.jwtPayload = decoded;
        next();

    } catch (err) {
        console.error(err);
        res.status(401).json({"error": "authorization denied"})
    }

}

// function to generate token

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET);
}



module.exports = {jwtAuthMiddleware, generateToken};