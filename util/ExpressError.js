class ExpressError extends Error {
    constructor(statusCode = 500, message = "Something went wrong") {
        super(message); // sets Error.message properly
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;