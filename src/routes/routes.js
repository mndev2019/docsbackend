const express = require('express');

const router = express.Router();

const upload = require(
  '../middleware/upload.js'
);

const {

  signup,

  login,

  forgotPassword,

  resetPassword,
  verifyOtp,

} = require('../controllers/authController');
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require(
  '../controllers/documentController.js'
);


// SIGNUP WITH IMAGE
// router.post(
//   '/signup',
//   upload.single('profileImage'),
//   signup
// );

router.post('/signup', signup);

router.post('/login', login);

router.post(
  '/forgot-password',
  forgotPassword
);

router.post(
  '/verify-otp',
  verifyOtp
);

router.post(
  '/reset-password',
  resetPassword
);

// UPLOAD
router.post(

  '/documentupload',

  upload.single('documentFile'),

  uploadDocument
);

router.get(
  '/getdocuments',
  getDocuments
);

router.delete(
  '/documents/:id',
  deleteDocument
);

module.exports = router;