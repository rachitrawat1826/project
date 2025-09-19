const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../model/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust"

main()
    .then(() => {
        console.log("connection to  DB")
    })
    .catch((err) => {
        console.log(err)
    })

async function main(params) {
    await mongoose.connect(MONGO_URL)
}

const initDB = async() => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "68c3cf0f466877d5761eaf40"
    }))
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB()