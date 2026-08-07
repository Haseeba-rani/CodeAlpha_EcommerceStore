// routes/auth.routes.js
const express = require('express');
const router = express.Router();

const { syncProfile } = require('../controllers/auth.controller');
const { syncProfileValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const verifyFirebaseAuth = require('../middlewares/auth.middleware');

// Called by the frontend immediately after a successful Firebase Auth
// signup, to create this user's Firestore profile (name, role).
router.post('/sync', verifyFirebaseAuth, syncProfileValidator, validate, syncProfile);

module.exports = router;
