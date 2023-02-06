const Teacher = require("../models/Teachers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserOTPVerification = require("../models/UserOTPVerification");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const signup = async (
  { fullname, collegeId, password, department, mobile },
  req,
  res,
  next
) => {
  try {
    const emailRegex = /@ms.pict.edu/;
    if (!emailRegex.test(collegeId)) throw "CollgeId is not valid";
    if (password.length < 6) throw "Password must be of atleast 6 characters";
    const user = await Teacher.findOne({ collegeId });
    if (user) {
      res.status(200).json("User is Already Exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);
    const newTeacher = new Teacher({
      fullname,
      collegeId,
      password : hashedpass,
      department,
      mobile,
      role: "teacher"
    });
    const teacher = await newTeacher.save();
    // await login({collegeId,password},req,res,next);
    // res.status(200).json(Teacher);
  } catch (err) {
    console.log(err);
    // res.status(500).json(err);
  }
};

const login = async (req, res, next) => {
  const { collegeId, password } = req.body;

  let existingUser;
  try {
    existingUser = await Teacher.findOne({ collegeId: collegeId });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup Please" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Inavlid collegeId / Password" });
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  // console.log("Generated Token\n", token);

  //   if (req.cookies[`${existingUser._id}`]) {
  //     req.cookies[`${existingUser._id}`] = "";
  //   }

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60), // 30 seconds
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Successfully Logged In", user: existingUser, token });
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  console.log(cookies);
  // let token = cookies.split("=")[1];
  let token = cookies.split("=")[2];
  // token = token.split(";")[0];
  if (!token) {
    res.status(404).json({ message: "No token found" });
  }

  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid TOken" });
    }
    // console.log(user.id);
    req.id = user.id;
  });
  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  // console.log(userId);
  let user;
  try {
    user = await Teacher.findById(userId, "-password");
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ messsage: "User Not FOund" });
  }
  return res.status(200).json({ user });
};
const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  // console.log(cookies);
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "35s",
    });
    // console.log("Regenerated Token\n", token);

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 30 seconds
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken = cookies.split("=")[1];
  // prevToken = prevToken.split(";")[0];
  // console.log(cookies + "\n\n" + prevToken);
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    // req.cookies[`${user.id}`] = "";
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

const sendOTPverificationEmail = async (req, res) => {
  try {
    const collegeId = req.body.collegeId;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: collegeId,
      subject: "Login OTP",
      html: `<p>Enter <h1>${otp}</h1> in the app to verify your college ID and complete the login process</p>`,
    };
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      collegeId: collegeId,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "PENDING",
      message: "Verification otp mail sent",
      data: {
        collegeId: collegeId,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: err.message,
    });
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    let { collegeId, otp } = req.body;
    if (!collegeId || !otp) {
      throw Error("Empty otp detials are not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        collegeId,
      });
      // console.log(UserOTPVerificationRecords);
      if (UserOTPVerificationRecords.length <= 0) {
        throw new Error("Account Does'nt exist or has been verified already");
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ collegeId });
          throw new Error("Code has expired. Please Request Again");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid Code");
          } else {
            // await Teacher.updateOne({ _id: studentId }, { verified: true });
            const { fullname, collegeId, password, department, mobile } =
              req.body;

            await UserOTPVerification.deleteMany({ collegeId });
            await signup(
              { fullname, collegeId, password, department, mobile },
              req,
              res,
              next
            );
            res.json({
              status: "VERIFIED",
              message: "User email verified successfully",
            });
          }
        }
      }
    }
  } catch (err) {
    res.json({
      status: "FAILED",
      message: err.message,
    });
  }
};
exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.verifyOTP = verifyOTP;
exports.sendOTPverificationEmail = sendOTPverificationEmail;
