const express = require("express");
const app = express();
const path = require("path");
const logger = require("./middleware/logger");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const uuid = require("uuid/v4");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: uuid()
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to moongo"));

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/datas", require("./router/datas"));

app.use("/api/users", require("./router/auth"));

app.use("/", require("./router/htmlrouter"));

app.listen(PORT, () => console.log("server started"));
