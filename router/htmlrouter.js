const express = require("express");
const router = express.Router();
const path = require("path");
cons = require("./jwt/verifyjwt");
const Course = require("../api/models/course");
const verify = require("./jwt/verifyjwt");

router.get("/", function(req, res) {
  res.redirect("/home");
});

router.get("/home", function(req, res) {
  req.session.current_url = req.originalUrl;
  res.render("index", {
    varified: false,
    admin_varified: req.session.session_veryficatied
  });
});

router.get("/about/:id", verify, (req, res) => {
  const userid = req.params.id;
  console.log(req.session.user_name);

  res.render("about", {
    varified: true,
    id: userid,
    name: req.session.user_name,
    admin_varified: req.session.session_veryficatied
  });
});
router.get("/about", async (req, res) => {
  req.session.current_url = req.originalUrl;
  res.render("about", {
    varified: false,
    admin_varified: req.session.session_veryficatied
  });
});

router.get("/contact/:id", verify, (req, res) => {
  const userid = req.params.id;
  res.render("contact", {
    varified: true,
    id: userid,
    name: req.session.user_name,
    admin_varified: req.session.session_veryficatied
  });
});
router.get("/contact", async (req, res) => {
  req.session.current_url = req.originalUrl;
  res.render("contact", {
    varified: false,
    admin_varified: req.session.session_veryficatied
  });
});

router.get("/home/:id", verify, (req, res) => {
  const userid = req.params.id;
  res.render("index", {
    varified: true,
    id: userid,
    name: req.session.user_name,
    admin_varified: req.session.session_veryficatied
  });
});

router.get("/course/:id", verify, async (req, res) => {
  const userid = req.params.id;
  const courses = await Course.find();
  res.render("course", {
    courses,
    varified: true,
    id: userid,
    name: req.session.user_name,
    admin_varified: req.session.session_veryficatied
  });
});

router.get("/course", async (req, res) => {
  req.session.current_url = req.originalUrl;

  const courses = await Course.find();
  res.render("course", {
    courses,
    varified: false,
    admin_varified: req.session.session_veryficatied
  });
});

module.exports = router;
