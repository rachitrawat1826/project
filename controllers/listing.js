console.log("[listingController] file loaded");

const Listing = require("../model/listing")

module.exports.index = async(req, res) => {
    const alllistings = await Listing.find({})
    res.render("index", { alllistings })
}

module.exports.renderNewForm = (req, res) => {
    res.render("new")
}

module.exports.showListing = async(req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listing) {
        req.flash("error", "listing you requested that not exist !")
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("show", { listing })
}


module.exports.createListing = async(req, res, next) => {
    try {
        console.log("👉 Entered createListing");

        const listing = new Listing(req.body.listing || {});
        console.log("👉 Listing body:", listing);

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            console.log("👉 File uploaded:", req.file.path);
        }

        listing.owner = req.user._id; // attach logged in user
        await listing.save();

        console.log("👉 Listing saved:", listing._id);

        // VERY IMPORTANT: send response
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("❌ Error in createListing:", err);
        next(err); // pass to error handler
    }
};
module.exports.createListing = async(req, res, next) => {
    try {
        console.log("👉 Entered createListing");

        const listing = new Listing(req.body.listing || {});
        console.log("👉 Listing body created");

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            console.log("👉 File attached:", req.file.filename);
        }

        listing.owner = req.user ? req.user._id : null;
        console.log("👉 Owner attached:", listing.owner);

        await listing.save();
        console.log("👉 Listing saved:", listing._id);

        res.send("✅ Listing created successfully"); // response should be sent here
    } catch (err) {
        console.error("❌ Error in createListing:", err);
        next(err);
    }
};


module.exports.destroyListing = async(req, res) => {
    let { id } = req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    req.flash("success", "listing Deleted successfully");
    res.redirect("/listings")
}