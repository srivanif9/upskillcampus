const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});
// Database Connection
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const blogRoutes = require("./routes/blogRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const activityRoutes = require("./routes/activityRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
// View Engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// Routes
app.use("/", authRoutes);
app.use("/", blogRoutes);
app.use("/", mediaRoutes);
app.use("/", profileRoutes);
app.use("/", settingsRoutes);
app.use("/", contactRoutes);
app.use("/", commentRoutes);
app.use("/", pageRoutes);
app.use("/", dashboardRoutes);
app.use("/", searchRoutes);
app.use("/", activityRoutes);
app.use("/", analyticsRoutes);
// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});