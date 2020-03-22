const express = require("express");
const router = express.Router();
const Register = require("../api/models/register");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JwtToken = require("../api/models/jwttoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const { check, validationResult } = require("express-validator");

router.get("/login", (req, res) => {
  console.log("session", "this is session " + req.session.current_url);
  res.render("login", { msg: "", url: req.session.current_url });
});

router.get("/register", (req, res) => {
  res.render("register", { msg: "", url: req.session.current_url });
});
router.post(
  "/register",
  [
    check("name")
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage("name be at least 6 chars long"),
    check("email")
      .isString()
      .isLength({ max: 30 })
      .withMessage("you exceeded character limit (30)")
      .isEmail()
      .withMessage("must be a valid email"),
    check("password")
      .isString()
      .isLength({ min: 6, max: 30 })
      .withMessage("password be at least 6 chars long")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    const register = new Register({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword,
      date: Date.now()
    });

    const userexist = await Register.findOne({ email: req.body.email });

    if (userexist) {
      return res.status(400).render("register", {
        msg: "Email already registerd",
        url: req.session.current_url
      });
    }

    result = register.save();
    console.log(register);

    const token = jwt.sign({ _id: register._id }, process.env.TOKEN_SECRET, {
      expiresIn: "12h"
    });
    jwtToken = new JwtToken({
      _id: new mongoose.Types.ObjectId(),
      jwt: register._id,
      name: register.name,
      token: token,
      date: Date().now
    });
    result = await jwtToken.save();
    req.session.session_veryficatied = true;
    console.log(jwtToken._id);

    if (!req.session.current_url) {
      return res.redirect(`/home/${jwtToken._id}`);
    }
    res.redirect(`${req.session.current_url}/${jwtToken._id}`);

    // res.redirect("/");
  }
);

//login
router.post(
  "/login",
  [
    check("email")
      .isString()
      .isLength({ max: 30 })
      .withMessage("you exceeded character limit (30)")
      .isEmail()
      .withMessage("must be a valid email"),
    check("password")
      .isString()
      .isLength({ min: 6, max: 30 })
      .withMessage("password be at least 6 chars long")
  ],
  async (req, res) => {
    const user = await Register.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).render("login", {
        msg: "your are not registered",
        url: req.session.current_url
      });
    }

    const validpass = await bcrypt.compare(req.body.password, user.password);
    if (!validpass) {
      return res.status(400).render("login", {
        msg: "worng password",
        url: req.session.current_url
      });
    }
    //jwt

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "12h"
    });
    jwtToken = new JwtToken({
      _id: new mongoose.Types.ObjectId(),
      jwt: user._id,
      name: user.name,
      token: token,
      date: Date().now
    });
    const userexist = await JwtToken.deleteOne({ jwt: user._id });
    jwtToken.save();

    req.session.session_veryficatied = true;
    if (!req.session.current_url) {
      return res.status(303).redirect(`/home/${jwtToken._id}`);
    }
    res.status(303).redirect(`${req.session.current_url}/${jwtToken._id}`);
  }
);

router.post("/google", (req, res) => {
  try {
    console.log(req.body.id);

    const client = new OAuth2Client(process.env.CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.id,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      console.log(payload);
      // If request specified a G Suite domain:
      //const domain = payload['hd'];
      const user = await Register.findOne({ email: payload.email });
      let user_id = user._id;
      if (!user) {
        const register = new Register({
          _id: new mongoose.Types.ObjectId(),
          name: payload.name,
          email: payload.email,
          password: "google-verified",
          date: Date.now()
        });
        user_id = register._id;
        const result = register.save();
      }
      if (!payload.email_verified) {
        return res.status(200).render("login", {
          msg: "E-mail could not be able to varify",
          url: req.session.current_url
        });
      }
      const token = jwt.sign({ _id: user_id }, process.env.TOKEN_SECRET, {
        expiresIn: "12h"
      });
      jwtToken = new JwtToken({
        _id: new mongoose.Types.ObjectId(),
        jwt: user_id,
        name: user.name,
        token: token,
        date: Date().now
      });
      const userexist = await JwtToken.deleteOne({
        jwt: user_id
      });
      jwtToken.save();

      req.session.session_veryficatied = true;
      if (!req.session.current_url) {
        return res.json({ url: `/home/${jwtToken._id}` }).status(200);
      }
      res
        .json({ url: `${req.session.current_url}/${jwtToken._id}` })
        .status(200);
    }
    verify().catch(console.error);
  } catch (err) {
    console.log(err);
  }
});

//jwt db

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await JwtToken.deleteOne({ _id: id }).exec();
    req.session.session_veryficatied = false;
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).redirect(303, "/");
  }
});

module.exports = router;
