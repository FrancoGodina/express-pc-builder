var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PcPartSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100},
        manufacturer: {type: Schema.Types.ObjectId, ref: "Manufacturer", required: true},
        category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
        description: {type: String, required: true, maxLength: 1000},
        stock: {type: Number, required: true, max: 999},
        price: {type: Number, required: true, max: 999},

    }
);

// Virtual for pcpart's URL
PcPartSchema.virtual("url").get(function() { return "/components/" + this._id; });

// Export model
module.exports = mongoose.model("PcPart", PcPartSchema);