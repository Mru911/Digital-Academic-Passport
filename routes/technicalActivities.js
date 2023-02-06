const router = require("express").Router();
const TechActivity = require("../models/TechnicalActivities");
const cloudinary = require("../utils/cloudinary");

router.post("/newTechActivity", async (req, res) => {
  const {
    club,
    sdate,
    edate,
    desc,
    file,
    sname,
    sdiv,
    srollno,
    sbatch,
    event,
    sid,
  } = req.body;
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "technical_Activities/",
    });
    const newExtra = new TechActivity({
      club,
      sdate,
      edate,
      desc,
      sname,
      sdiv,
      srollno,
      sbatch,
      event,
      sid,
      file: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    const extra = await newExtra.save();
    res.status(200).json(extra);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});




router.get("/getbysid/:id", async (req, res) => {
  const sid = req.params.id;
  try {
    const amcats = await TechActivity.find({ sid: sid });
    res.status(200).json(amcats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/getbybatch/:batch", async (req, res) => {
  const sbatch = req.params.batch;
  try {
    const amcats = await TechActivity.find({ sbatch });
    res.status(200).json(amcats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/getbydiv/:div", async (req, res) => {
  const sdiv = req.params.div;
  try {
    const amcats = await TechActivity.find({ sdiv });
    res.status(200).json(amcats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.delete("/deletetechactivity/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const acti = await TechActivity.findOne({ _id: id });
    // console.log(notice);
    const fileId = acti.file?.public_id;
    fileId && await cloudinary.uploader.destroy(fileId);
    await TechActivity.findOneAndDelete({ _id: id });
    res.status(200).json("Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
