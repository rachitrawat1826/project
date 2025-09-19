const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js")
const { reviewSchema } = require("../schema.js")
const ExpressError = require("../util/ExpressError.js")
const Listing = require("../model/listing.js")
const Review = require("../model/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js")



const validateReveiw = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

//post  rout

router.post("/", isLoggedIn, validateReveiw, wrapAsync(reviewController.createReview))

//Delete  review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;