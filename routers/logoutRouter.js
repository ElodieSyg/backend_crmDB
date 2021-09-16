const express = require("express");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        res.clearCookie('jwt', '', { path: '/' })
            .status(200)
            .json({ message: "You are offline" })
    });

module.exports = router;