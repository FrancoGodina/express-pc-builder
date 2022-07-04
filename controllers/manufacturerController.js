var Manufacturer = require('../models/manufacturer');
var PcPart = require("../models/pcpart");
var Category = require("../models/category");

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
exports.manufacturer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer create GET');
};

// Handle Manufacturer create on POST.
exports.manufacturer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Manufacturer create POST');
};

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