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




module.exports.createListing = async(req, res) => {
    try {
        const { path: url, filename } = req.file;

        const listing = new Listing(req.body.listing);
        listing.image = { url, filename };

        listing.owner = req.user._id;
        await listing.save();

        req.flash("success", "Successfully created a new listing!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings");
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