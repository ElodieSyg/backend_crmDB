const express = require("express");
const JWT = require("jsonwebtoken");
const router = express.Router();
// Import models
const Contact = require("../models/contactModel");
// Import middleware
const protect = require("../middlewares/protect");

router.route("/")
    .get(protect, async (req, res) => {
        const contacts = await Contact.find({ userId: req.cookies.jwtData._id }).populate("userId");

        res.status(200).json({
            message: "Contact list",
            data: contacts,
        });
    })
    .post(async (req, res) => {
        const { userId, name, email, description, category } = req.body;

        if (category >= 1 && category <= 5) {
            try {
                await Contact.create({ userId, name, email, description, category });
            } catch (error) {
                return res.json({
                    message: "Email is already use",
                });
            };
        } else {
            return res.status(400).json({
                message: "Category incorrect",
            });
        };

        res.status(201).json({
            message: `${name} was added to your contact book`,
        });
    });

router.route("/:id")
    .put(async (req, res) => {
        const { userId, name, email, description, category } = req.body;

        try {
            await Contact.findByIdAndUpdate(req.params.id, { userId, name, email, description, category });
        } catch (error) {
            return res.status(400).json({
                error,
            });
        };

        res.status(200).json({
            message: "User informations was update",
        });
    })
    .delete(async (req, res) => {
        try {
            await Contact.findByIdAndDelete(req.params.id);
        } catch (error) {
            return res.status(400).json({
                error,
            });
        };

        res.status(200).json({
            message: "User was delete",
        });
    });

// Query with name "/contact/name?name=${name.type.String}"
router.route("/name")
    .get(async (req, res) => {
        try {
            const name = req.query.name;
            const fullName = name.substring(0, 1).toUpperCase() + name.substring(1);
            const data = await Contact.findOne({ name: fullName })

            res.status(200).json({
                message: "Ok",
                data: data,
            });
        } catch (error) {
            return res.status(404).json({
                message: "Page not found"
            });
        };
    });

// Query with category "/contact/category?category=${category.type.Number}"
router.route("/category")
    .get(async (req, res) => {
        const categoryNumber = parseInt(req.query.category);

        if (categoryNumber < 1 || categoryNumber > 5) {
            return res.status(404).json({
                message: "Page not found",
            });
        };

        try {
            const data = await Contact.aggregate([
                {
                    $match: {
                        category: { $eq: categoryNumber },
                    },
                }
            ]);

            console.log(categoryNumber, data)

            res.status(200).json({
                data: data,
            })
        } catch (error) {
            return res.status(404).json({
                message: "Page not found"
            });
        };
    });

router.route("/email")
    .get(async (req, res) => {
        const email = req.query.email;
        const emailDatabase = await Contact.findOne({ email: req.query.email });

        if (!emailDatabase) {
            return res.status(404).json({
                message: "Email does not exist",
            });
        };

        try {
            const data = await Contact.aggregate([
                {
                    $match: { email: { $eq: email } },
                },
            ]);

            res.status(200).json({
                data,
            });
        } catch (error) {
            return res.status(404).json({
                message: "Page not  found",
            });
        };
    });

module.exports = router;