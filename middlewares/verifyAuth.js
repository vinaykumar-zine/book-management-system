const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization;
    if(!token) {
        return res.status(401).send("Access denied!");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    next();}
    catch(err){
        res.status(400).send("Invalid Token");
    }
}


module.exports = {verifyAuth};