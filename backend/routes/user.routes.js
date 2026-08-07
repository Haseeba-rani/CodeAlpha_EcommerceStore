// routes/user.routes.js
const express = require('express');
const router = express.Router();

const { getMyProfile, updateMyProfile } = require('../controllers/user.controller');
const { updateProfileValidator } = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');
const verifyFirebaseAuth = require('../middlewares/auth.middleware');

// All routes below require a valid Firebase ID token.
router.use(verifyFirebaseAuth);

router.get('/me', getMyProfile);
router.put('/me', updateProfileValidator, validate, updateMyProfile);

module.exports = router;
