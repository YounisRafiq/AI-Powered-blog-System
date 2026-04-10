const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("../src/routes/blog.routes")
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/blog" , blogRoutes);

module.exports = app;

