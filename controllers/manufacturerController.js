var Manufacturer = require('../models/manufacturer');
var PcPart = require("../models/pcpart");
var Category = require("../models/category");

const { body, validationResult } = require("express-validator");
var async = require("async");

// Display list of all Manufacturers.
exports.manufacturer_list = function(req, res, next) {
    
    Manufacturer.find()
        .sort({name : 1})
        .exec(function (err, list_manufacturers) {
            if(err) { return next(err); }
            
            res.render("manufacturer_list", { title: "Manufacturer List", manufacturer_list: list_manufacturers });
        });
};

// Display detail page for a specific Manufacturer.
exports.manufacturer_detail = function(req, res, next) {
    
    async.parallel(
        {
            manufacturer: function(callback) {
                Manufacturer.findById(req.params.id)
                    .exec(callback)
            },
            manufacturer_parts: function(callback) {
                PcPart.find({ manufacturer: req.params.id })
                    .populate("manufacturer")
                    .populate("manufacturer")
                    .exec(callback)
            },
        }, 
        function(err, results) {
            if(err) { return next(err) }
            
            if(results.manufacturer == null) {
                var err = new Error("Manufacturer not found");
                err.status = 404;
                return next(err);
            }

            res.render("manufacturer_detail", { 
                title: results.manufacturer.title,
                manufacturer: results.manufacturer,
                manufacturer_parts: results.manufacturer_parts
            });
        }
    );
};

// Display Manufacturer create form on GET.
exports.manufacturer_create_get = function(req, res, next) {
    res.render("manufacturer_form", { title: "Create Manufacturer" });
};

// Handle Manufacturer create on POST.
exports.manufacturer_create_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Manufacturer name must be specified"),
    body("description")
        .escape()
        .optional({ checkFalsy: true }),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render("manufacturer_form", {
                title: "Create manufacturer",
                manufacturer: req.body,
                isUpdating: false,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid.
            // Create a manufacturer object with escaped and trimmed data.
            var manufacturer = new Manufacturer({
                name: req.body.name,
                description: req.body.description
            });
            manufacturer.save(function (err) {
                if(err) { return next(err) };
                res.redirect(manufacturer.url)
            })
        }
    }
]

// Display Manufacturer delete form on GET.
exports.manufacturer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer delete GET');
};

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer delete POST');
};

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer update GET');
};

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer update POST');
};