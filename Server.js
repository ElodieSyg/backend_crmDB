const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({
    path: "./config.env",
});
const mongoose = require("mongoose");
// Import middlewares
const debug = require("./middlewares/debug");
// Import routers
const registerRouter = require("./routers/registerRouter");
const loginRouter = require("./routers/loginRouter");
const contactRouter = require("./routers/contactsRouter");
const logoutRouter = require("./routers/logoutRouter");

// MongoDB connection
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to MongoDB !");
    });

// Middlewares
app.use(express.json());
app.use(debug);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/contacts", contactRouter);
app.use("/logout", logoutRouter);

// Starting server
app.listen(process.env.PORT, () => {
    console.log("Server started, listening on port", process.env.PORT);
});