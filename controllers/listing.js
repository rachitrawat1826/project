console.log("[listingController] file loaded");

const Listing = require("../model/listing")

module.exports.index = async(req, res) => {
    const listings = await Listing.find({});
    res.render("index", { listings }); // ✅ correct path
};


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
        console.log("👉 req.file:", req.file);
        console.log("👉 req.body:", req.body);

        const listing = new Listing(req.body.listing || {});

        if (req.file) {
            listing.image = {
                url: `/uploads/${req.file.filename}`,
                filename: req.file.filename
            };
        }

        listing.owner = req.user._id;
        await listing.save();

        req.flash("success", "Listing created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
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