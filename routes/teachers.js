const router = require("express").Router();
const Teachers = require("../models/Teachers");
const cloudinary = require("../utils/cloudinary");

// const bcrypt = require("bcrypt");
// const
// const jwt = require("jsonwebtoken");
const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  sendOTPverificationEmail,
  verifyOTP,
  refreshToken,
  logout,
} = require("../controllers/Teachers_Controller");


router.post("/signupOTP",sendOTPverificationEmail);
router.post("/signupVerify",verifyOTP);
// router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
// router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);





router.put("/teacher/profile/update/:id", async (req, res) => {
  try {
    const teacher = await Teachers.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    // await student.update({ $set: req.body });
    // const updatedstudent = await Teachers.findOne({
    //   _id: req.params.id,
    // });
    // console.log(updatedstudent);
    res.status(200).json(teacher);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/teacher/profile/update_profile/:id", async (req, res) => {
  try {
    const profileimg = teacher.profile?.public_id;
    if (profileimg) {
      await cloudinary.uploader.destroy(profileimg);
    }teacher
    const teacher = await Teachers.findById({ _id: req.params.id });
    const { profile } = req.body;
    const file = profile;
    const result = await cloudinary.uploader.upload(file, {
      folder: "teacher/",
    });
    const data = {};
    console.log(data);
    await teacher.updateOne({
      $set: {
        profile: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
    });
    const updatedstudent = await Teachers.findOne({
      _id: req.params.id,
    });
    res.status(200).json(updatedstudent);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;