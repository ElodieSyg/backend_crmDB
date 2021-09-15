const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    userId: {
        type: [{ type: mongoose.Types.ObjectId, ref: "users" }],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
});

const Contact = mongoose.model("contacts", ContactSchema);

module.exports = Contact;