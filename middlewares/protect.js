const jwt = require("jsonwebtoken");

const protect = (req, res, next) => { // check pourquoi je rentre toujours dans token is not valid
    try {
        const data = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        console.log(data)
        req.cookies.jwtData = data;
        next();
    } catch (err) {
        console.log(data)
        return res.status(401).json({
            message: "Your token is not valid",
        });
    };
};

module.exports = protect;