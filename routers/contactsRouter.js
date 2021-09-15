const express = require("express");
const router = express.Router();
// Import models
const Contact = require("../models/contactModel");

router.route("/")
    .get(async (_req, res) => {
        const contacts = await Contact.find().populate("userId");

        res.status(200).json({
            message: "Users list",
            data: contacts,
        });
    })
    .post(async (req, res) => {
        const { userId, name, email, description, category } = req.body;

        try {
            await Contact.create({ userId, name, email, description, category });
        } catch (error) {
            return res.status(400).json({
                message: "This contact already exist",
            });
            /* if (Contact.ContactSchema.category > 6) {  // Check la confition category > 6
                return res.json({
                    message: "Incorrect category",
                });
            } else {
                return res.status(400).json({
                    message: "This contact already exist",
                });
            }; */
        };

        res.status(201).json({
            message: `${name} was added to your contact book`,
        });
    })

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

router.route("/name")
    .get(async (_req, res) => {
        try {
            const data = await Contact.aggregate([
                {
                    $match: { name: "Eleonora" },
                },
            ]);

            res.status(200).json({
                data,
            });
        } catch (error) { // Je ne rentre pas dans les catch
            return res.status(404).json({
                message: "Page not found"
            });
        };
    });

router.route("/category")
    .get(async (req, res) => {
        try {
            const data = await Contact.aggregate([
                {
                    $match: { category: 2 },
                },
            ]);

            res.status(200).json({
                data,
            })
        } catch (error) { // Je ne rentre pas dans les catchs
            return res.status(404).json({
                message: "Page not found"
            });
        };
    });

module.exports = router;