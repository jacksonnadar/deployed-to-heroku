const express = require("express");
const router = express.Router();
const Course = require("../api/models/course");
const mongoose = require("mongoose");
const session_varify = require("./jwt/verifyreq");
const upload = require("../middleware/multer");
const cloud = require("cloudinary");
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
    const course = await Course.findOne({ _id: id }).exec();

    const result = await Course.deleteOne({ _id: id }).exec();

    cloud.uploader.destroy(course.image_id, function(error, result) {
      console.log(result, error);
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post(
  "/update/:id",
  /*session_varify,*/ upload.any(),
  async (req, res) => {
    try {
      console.log("files", req.files);
      let changes = [];
      if (req.body.name) {
        changes.push({ propName: "name", value: req.body.name });
      }
      if (req.body.disc) {
        changes.push({ propName: "disc", value: req.body.disc });
      }
      if (req.body.tag) {
        changes.push({ propName: "tag", value: req.body.tag });
      }
      if (req.body.fees) {
        changes.push({ propName: "fees", value: req.body.fees });
      }
      if (req.files[0]) {
        console.log(req.body.id);
        const seperatedid = req.body.id.split("+");
        const image_id = seperatedid[1];

        cloud.uploader.destroy(image_id, function(error, result) {
          console.log(result, error);
        });

        const uploader = async path => await cloudinary.uploads(path, "Images");

        const files = req.files;
        console.log(files);
        const { path } = files[0];
        const newPath = await uploader(path);
        fs.unlinkSync(path);
        changes.push(
          { propName: "image_url", value: newPath.url },
          { propName: "image_id", value: newPath.id }
        );
      }
      const updateopt = {};
      for (const opt of changes) {
        updateopt[opt.propName] = opt.value;
        console.log(updateopt);
      }
      const id = req.params.id;
      const result = await Course.updateOne(
        { _id: id },
        {
          $set: updateopt
        }
      );
      res.status(200).redirect("back");

      // console.log("new file  " + req.files);
      // console.log("body " + req.body);

      // const id = req.params.id;
      // console.log(id);
      // console.log(req.body);
      // const updateopt = {};
      // for (const opt of req.body) {
      //   updateopt[opt.propName] = opt.value;
      //   console.log(updateopt);
      // }
      // //[{"propName":"name","value":" new value"}]
      // const result = await Course.updateOne(
      //   { _id: id },
      //   {
      //     $set: updateopt
      //   }
      // );
      // res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
);
router.post("/", /*session_varify,*/ upload.any(), async (req, res) => {
  try {
    const uploader = async path => await cloudinary.uploads(path, "Images");

    // const urls = [];

    const files = req.files;
    console.log(files);
    // for (file of files) {
    const { path } = files[0];
    const newPath = await uploader(path);
    // urls.push(newPath);
    fs.unlinkSync(path);
    // }

    const course = new Course({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      disc: req.body.disc,
      date: new Date(),
      tag: req.body.tag,
      fees: req.body.fees,
      image_url: newPath.url,
      image_id: newPath.id
    });
    const result = await course.save();
    // res.status(200).json({ msg: "succes", urls: newPath });

    res.status(200).redirect("back");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
