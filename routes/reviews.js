const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware');
const reviews = require('../controllers/reviews');

router.post('/',
    isLoggedIn,
    validateReview,
    reviews.createReview);

router.delete('/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    reviews.deleteReview);

module.exports = router;
