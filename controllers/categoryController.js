var Category = require('../models/category');
var Manufacturer = require("../models/manufacturer");
var PcPart = require("../models/pcpart");

var async = require("async");

exports.index = function(req, res) {

    async.parallel(
        {
            category_count: function(callback) {
                Category.countDocuments({}, callback)
            },
            manufacturer_count: function(callback) {
                Manufacturer.countDocuments({}, callback)
            },
            pcpart_count: function(callback) {
                PcPart.countDocuments({}, callback)
            }
        },
        function(err, results) {
            res.render("index", { title: "Pc Builder", error: err, data: results});
        }
    );
};

// Display list of all Categories.
exports.category_list = function(req, res, next) {

    Category.find({}, "title description")
        .sort({title : 1})
        .exec(function (err, list_categories) {
            if(err) { return next(err); }

            res.render("category_list", {title: "Category List", category_list: list_categories });
        });
};

// Display detail page for a specific Category.
exports.category_detail = function(req, res, next) {

    async.parallel(
        {
            category: function(callback) {
                Category.findById(req.params.id)
                    .exec(callback)
            },
            category_parts: function(callback) {
                PcPart.find({ category: req.params.id })
                    .populate("category")
                    .populate("manufacturer")
                    .exec(callback)
            },
        }, 
        function(err, results) {
            if(err) { return next(err) }
            if(results.category == null) {
                var err = new Error("Category not found");
                err.status = 404;
                return next(err);
            }

            res.render("category_detail", { 
                title: results.category.title,
                category: results.category,
                category_parts: results.category_parts
            });
        }
    );
};

// Display Category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create GET');
};

// Handle Category create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create POST');
};

// Display Category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update POST');
};