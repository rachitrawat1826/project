const express = require("express")
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js")
const { listingSchema } = require("../schema.js")
const ExpressError = require("../util/ExpressError.js")
const Listing = require("../model/listing.js")
const { isLoggedIn, isOwner } = require("../middleware.js")

const listingController = require("../controllers/listing.js")
const multer = require('multer')
const { storage } = require("../cloudconfig.js")
const upload = multer({ storage })



// const validateListing = (req, res, next) => {
//     let result = listingSchema.validate(req.body);
//     if (result.error) {
//         let errMsg = error.details.map((el) => el.message).join(",")
//         throw new ExpressError(400, error)
//     } else {
//         next()
//     }
// }



router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("image"),
        (req, res, next) => {
            let { file, path } = req.params
            console.log(file, path)
            console.log("👉 File object:", req.file); // raw object
            console.log("👉 File JSON:", JSON.stringify(req.file, null, 2)); // formatted
            console.log("👉 Body object:", req.body); // body fields
            next();
        },
        wrapAsync(listingController.createListing)
    );




// router.post(
//     "/",
//     isLoggedIn,
//     upload.single("image"),
//     listingController.createListing
// );

//new
router.get("/new", isLoggedIn, listingController.renderNewForm)


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))



//EDIT

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;