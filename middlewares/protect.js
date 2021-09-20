const JWT = require("jsonwebtoken");

function protect(req, res, next) {
    try {
        const data = JWT.verify(req.cookie.jwt, process.env.JWT_SECRET);
        req.cookie.jwtData = data;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Your token is not valid"
        });
    };
};

module.exports = protect;