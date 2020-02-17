const express = require("express");
const router = express.Router();
const Course = require("../api/models/course");
const mongoose = require("mongoose");
const session_varify = require("./jwt/verifyreq");
const upload = require("../middleware/multer");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");

router.get("/", async (req, res) => {
  try {
    const coursedata = await Course.find().exec();
    res.status(200).json(coursedata);
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const coursedata = await Course.findById(id).exec();
    coursedata;
    if (coursedata) {
      res.status(200).json(coursedata);
    } else {
      res.status(404).json({ message: "could no able to find" });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
});
router.delete("/:id", session_varify, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Course.remove({ _id: id }).exec();

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.patch("/:id", session_varify, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    console.log(req.body);
    const updateopt = {};
    for (const opt of req.body) {
      updateopt[opt.propName] = opt.value;
      console.log(updateopt);
    }
    //[{"propName":"name","value":" new value"}]
    const result = await Course.updateOne(
      { _id: id },
      {
        $set: updateopt
      }
    );
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.post("/", /*session_varify,*/ upload.any(), async (req, res) => {
  try {
    const uploader = async path => await cloudinary.uploads(path, "Images");

    const urls = [];

    const files = req.files;

    files.forEach(async file => {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    });

    const course = new Course({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      disc: req.body.disc,
      date: new Date(),
      tag: req.body.tag,
      fees: req.body.fees
    });
    const result = await course.save();
    res.status(200).json({ msg: "succes", urls });

    // res.status(200).redirect("back");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
