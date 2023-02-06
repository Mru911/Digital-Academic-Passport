const router = require("express").Router();
const Amcat = require("../models/Amcat");
const cloudinary = require("../utils/cloudinary");

router.post("/newamcat", async (req, res) => {
  const {
    english,
    logical,
    automata,
    quantitative,
    report,
    dashboard,
    attempt,
    sid,
    sname,
    sdiv,
    sbatch,
    srollno,
  } = req.body;

  try {
    const rresult = await cloudinary.uploader.upload(report, {
      folder: "amcat_details/",
    });
    const dresult = await cloudinary.uploader.upload(dashboard, {
      folder: "amcat_details/",
    });

    const newAmcat = new Amcat({
      english,
      logical,
      automata,
      attempt,
      quantitative,
      report: {
        public_id: rresult.public_id,
        url: rresult.secure_url,
      },
      dashboard: {
        public_id: dresult.public_id,
        url: dresult.secure_url,
      },
      sid,
      sname,
      sdiv,
      sbatch,
      srollno,
    });
    const amcat = await newAmcat.save();
    res.status(200).json(amcat);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/getbysid/:id", async (req, res) => {
  const sid = req.params.id;
  try {
    const amcats = await Amcat.find({ sid: sid });
    res.status(200).json(amcats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/getbybatch/:batch", async (req, res) => {
  const sbatch = req.params.batch;
  try {
    const amcats = await Amcat.find({ sbatch });
    res.status(200).json(amcats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/getbydiv/:div", async (req, res) => {
  const sdiv = req.params.div;
  try {
    const amcats = await Amcat.find({ sdiv });
    res.status(200).json(amcats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/deleteAmcat/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const acti = await Amcat.findOne({ _id: id });
    // console.log(notice);
    const fileId = acti.report?.public_id;
    const fileId2 = acti.dashboard?.public_id;
    fileId && await cloudinary.uploader.destroy(fileId);
    fileId2 && await cloudinary.uploader.destroy(fileId2);
    await Amcat.findOneAndDelete({ _id: id });
    res.status(200).json("Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
