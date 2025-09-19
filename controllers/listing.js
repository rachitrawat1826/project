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
    if (!req.body.listing.image || !req.body.listing.image.url || req.body.listing.image.url.trim() === "") {
        req.body.listing.image = {
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // default fallback
            filename: "default"
        };
    }

    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created !");
    res.redirect("/listings");
}

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