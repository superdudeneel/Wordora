const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    blogId: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true}
)

const likeModel = mongoose.model("like", likeSchema);

module.exports = likeModel;