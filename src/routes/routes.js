const express = require('express');

const router = express.Router();

const upload = require(
  '../middleware/upload.js'
);

const {

  signup,
  getProfile,
  editProfile,
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
const {
    reportProblem,
    getAllReports
} = require('../controllers/reportController');
const auth = require('../middleware/auth.js');


// SIGNUP WITH IMAGE
// router.post(
//   '/signup',
//   upload.single('profileImage'),
//   signup
// );

router.post('/signup', signup);
router.get('/profile', auth, getProfile);
router.put('/edit-profile',auth, upload.single('profileImage'), editProfile);

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

//report problem
router.post(
    '/report-problem',
    auth,
    upload.single('screenshot'),
    reportProblem
);

router.get(
    '/all-reports',
    getAllReports
);

module.exports = router;