const express = require('express');
const router = express.Router();
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn,
        upload.array('images', 10),
        validateCampground,
        campgrounds.createCampground);

router.get('/new',
    isLoggedIn,
    campgrounds.renderNewForm);

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn,
        isAuthor,
        upload.array('images', 3),
        validateCampground,
        campgrounds.updateCampground)
    .delete(isLoggedIn,
        isAuthor,
        campgrounds.deleteCampground);

router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    campgrounds.renderEditForm);

module.exports = router;
