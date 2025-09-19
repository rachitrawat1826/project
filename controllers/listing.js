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
        console.log("[createListing] hit POST /listings");

        console.log("[createListing] req.body:", req.body);
        console.log("[createListing] req.file:", req.file);

        const { path: url, filename } = req.file || {}; // handle if no file
        const listing = new Listing(req.body.listing);
        if (url && filename) {
            listing.image = { url, filename };
        }

        listing.owner = req.user._id;
        await listing.save();

        console.log("[createListing] saved listing:", listing._id);

        req.flash("success", "Successfully created a new listing!");
        return res.redirect(`/listings/${listing._id}`); // ✅ MUST RETURN
    } catch (err) {
        console.error("[createListing] ERROR:", err);
        return next(err); // let error middleware handle it
    }
};



module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "listing you requested that not exist !")
        return res.redirect("/listings")
    }
    res.render("edit", { listing })
}

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let updatedData = {...req.body.listing };


    if (updatedData.image && (!updatedData.image.url || updatedData.image.url.trim() === "")) {
        delete updatedData.image;
    }
    await Listing.findByIdAndUpdate(id, updatedData);
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req, res) => {
    let { id } = req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    req.flash("success", "listing Deleted successfully");
    res.redirect("/listings")
}