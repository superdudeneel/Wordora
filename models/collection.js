const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    savedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true}
)

const collectionModel = mongoose.model("collection", collectionSchema);

module.exports = collectionModel;