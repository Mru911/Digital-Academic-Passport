const router = require("express").Router();
const Notices = require("../models/Notices");
const cloudinary = require("../utils/cloudinary");

router.post("/newNotice", async (req, res) => {
  const { heading, notice_by, desc, forw, teacher_id, important } = req.body;
  try {
    const newNotice = new Notices({
      heading,
      notice_by,
      desc,
      forw,
      teacher_id,
      important,
    });
    const notice = await newNotice.save();
    res.status(200).json(notice);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/newNoticefile", async (req, res) => {
  const { heading, notice_by, desc, forw, teacher_id, important, file } =
    req.body;
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "notices/",
    });
    const newNotice = new Notices({
      heading,
      notice_by,
      desc,
      forw,
      teacher_id,
      important,
      file: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    const notice = await newNotice.save();
    res.status(200).json(notice);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/getallnotices", async (req, res) => {
  try {
    const notices = await Notices.find();
    res.status(200).json(notices);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/getbyforw/:forw", async (req, res) => {
  try {
    const forw = req.params.forw;
    const internships = await Notices.find({ forw: forw });
    res.status(200).json(internships);
  } catch (err) {
    console.log(err);
    res.status(500).json("Unable To Fetch");
  }
});

router.get("/getallTeacherNotices/:tid", async (req, res) => {
  try {
    const notices = await Notices.find({ teacher_id: req.params.tid });
    res.status(200).json(notices);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/updateNotice/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Notices.findByIdAndUpdate(
      {
        _id: id,
      },
      { $set: req.body }
    );
    res.status(200).json("Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/deleteNotice/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const notice = await Notices.findOne({ _id: id });
    // console.log(notice);
    const fileId = notice.file?.public_id;
    fileId && await cloudinary.uploader.destroy(fileId);
    await Notices.findOneAndDelete({ _id: id });
    res.status(200).json("Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
