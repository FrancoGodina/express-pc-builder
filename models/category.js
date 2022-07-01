var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 50},
        description: {type: String, required: true, maxLength: 1000}
    }
);

// Virtual for category's URL
CategorySchema.virtual("url").get(function() { return "/category/" + this._id });

// Export model
module.exports = mongoose.model("Category", CategorySchema);