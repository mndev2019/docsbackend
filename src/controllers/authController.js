const otpGenerator = require('otp-generator');
const sendEmail = require('../config/SendEmail');
const User = require('../models/User');

const bcrypt = require('bcryptjs');

const generateToken = require('../utils/generateToken');


// SIGNUP
exports.signup = async (req, res) => {

  try {

    const {
      name,
      email,
      mobile,
      password,
      reEnterPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !reEnterPassword
    ) {

      return res.status(400).json({
        success: false,
        message: 'All Fields Required',
      });

    }

    if (password !== reEnterPassword) {

      return res.status(400).json({
        success: false,
        message: 'Passwords Do Not Match',
      });

    }

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(400).json({
        success: false,
        message: 'User Already Exists',
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CLOUDINARY IMAGE URL
    const profileImage = req.file
      ? req.file.path
      : '';

    const user = await User.create({

      name,

      email,

      mobile,

      password: hashedPassword,

      profileImage,

    });

    res.status(201).json({

      success: true,

      message: 'Signup Successful',

      token: generateToken(user._id),

      user,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: 'All Fields Required',
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: 'User Not Found',
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials',
      });

    }

    res.status(200).json({
      success: true,
      message: 'Login Successful',
      token: generateToken(user._id),
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// FORGOT PASSWORD
exports.forgotPassword = async (
  req,
  res
) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(400).json({

        success: false,

        message: 'User Not Found',

      });

    }

    // GENERATE OTP
    const otp = otpGenerator.generate(6, {

      upperCaseAlphabets: false,

      lowerCaseAlphabets: false,

      specialChars: false,

    });

    user.resetOtp = otp;

    user.resetOtpExpire =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // SEND EMAIL
    await sendEmail({

      sender: {

        name: 'Docs App',

        email: process.env.BREVO_EMAIL,

      },

      to: [
        {
          email: email,
        },
      ],

      subject: 'Password Reset OTP',

      htmlContent: `

        <h2>Password Reset OTP</h2>

        <h1>${otp}</h1>

        <p>OTP valid for 5 minutes</p>

      `,
    });

    res.status(200).json({

      success: true,

      message: 'OTP Sent To Email',

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.response?.data ||
        error.message,

    });

  }

};

// VERIFY OTP
// exports.verifyOtp = async (
//   req,
//   res
// ) => {

//   try {

//     const {
//       email,
//       otp,
//     } = req.body;

//     const user =
//       await User.findOne({
//         email,
//       });

//     if (!user) {

//       return res.status(400).json({

//         success: false,

//         message:
//           'User Not Found',

//       });

//     }

//     // CHECK OTP
//     if (

//       String(user.resetOtp)
//       !==
//       String(otp)

//     ) {

//       return res.status(400).json({

//         success: false,

//         message:
//           'Invalid OTP',

//       });

//     }

//     // OTP EXPIRE
//     if (
//       user.resetOtpExpire
//       < Date.now()
//     ) {

//       return res.status(400).json({

//         success: false,

//         message:
//           'OTP Expired',

//       });

//     }

//     res.status(200).json({

//       success: true,

//       message:
//         'OTP Verified',

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message:
//         error.message,

//     });

//   }

// };
exports.verifyOtp = async (req, res) => {

  try {

    console.log('VERIFY OTP API HIT');

    const { email, otp } = req.body; // 🔥 FIX HERE

    const user = await User.findOne({ email });

    console.log('USER:', user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User Not Found',
      });
    }

  

    if (user.resetOtp !== otp) {
      console.log('OTP NOT MATCHED');

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    console.log('OTP VERIFIED SUCCESS');

    res.status(200).json({
      success: true,
      message: 'OTP Verified',
    });

  } catch (error) {

    console.log('VERIFY OTP ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// RESET PASSWORD

exports.resetPassword = async (req, res) => {
  try {

   

    const {
      email,
      newPassword,
      reEnterPassword,
    } = req.body;

 

    const user = await User.findOne({ email });

    console.log("USER FOUND:", user);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(400).json({
        success: false,
        message: 'User Not Found',
      });
    }

    if (!newPassword || !reEnterPassword) {
      console.log("❌ EMPTY PASSWORD FIELDS");
      return res.status(400).json({
        success: false,
        message: 'All Fields Required',
      });
    }

    if (newPassword !== reEnterPassword) {
      console.log("❌ PASSWORD NOT MATCHING");
      return res.status(400).json({
        success: false,
        message: 'Passwords Do Not Match',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log("🔐 HASHED PASSWORD:", hashedPassword);

    user.password = hashedPassword;

    console.log("BEFORE SAVE USER:", user);

    await user.save();

    console.log("✅ AFTER SAVE USER:", user);

    res.status(200).json({
      success: true,
      message: 'Password Reset Successful',
    });

  } catch (error) {

    console.log("❌ RESET ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};