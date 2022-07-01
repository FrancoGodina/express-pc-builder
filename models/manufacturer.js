var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ManufacturerSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 50},
        description: {type: String, required: true, maxLength: 1000}
    }
);

// Virtual for manufacturer's URL
ManufacturerSchema.virtual("url").get(function() { return "/manufacturer/" + this._id });

// Export model
module.exports = mongoose.model("Manufacturer", ManufacturerSchema);