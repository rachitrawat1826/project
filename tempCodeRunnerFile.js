app.all("*", (req, res, next) => {
    next(new ExpressError("page not found"))
})
