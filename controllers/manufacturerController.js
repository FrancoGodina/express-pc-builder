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
exports.manufacturer_delete_get = function(req, res, next) {
    
    async.parallel({
        manufacturer: function(callback) {
            Manufacturer.findById(req.params.id).exec(callback)
        },
        manufacturer_parts: function(callback) {
            PcPart.find({ manufacturer: req.params.id }).exec(callback)
        }
    },
    function(err, results) {
        if(err) return next(err)

        if(results.manufacturer == null) {
            res.redirect("/catalog/manufacturers");
        }

        res.render("manufacturer_delete", { 
            title: "Delete Manufacturer",
            manufacturer: results.manufacturer,
            manufacturer_parts: results.manufacturer_parts
        })
    })
};

// Handle Manufacturer delete on POST.
exports.manufacturer_delete_post = function(req, res, next) {
    if(req.body.password != process.env.ADMIN_PASSWORD) {
        let err = new Error("The password you entered is incorrect.");
        err.status = 401;
        return next(err);
    }
    else {
        async.parallel(
            {
                manufacturer: function(callback) {
                    Manufacturer.findById(req.params.id).exec(callback)
                },
                manufacturer_parts: function(callback) {
                    PcPart.find({ "manufacturer": req.params.id }).exec(callback)
                }
            },
            function(err, results) {
                if(err) return next(err);

                if(results.manufacturer_parts.length > 0) {
                    res.render("manufacturer_delete", {
                        title: "Delete Manufacturer",
                        manufacturer: results.manufacturer,
                        manufacturer_parts: results.manufacturer_parts
                    })
                    return;
                }
                else {
                    Manufacturer.findByIdAndRemove(
                        req.body.manufacturerid, 
                        function deleteManufacturer(err) {
                            if(err) return next(err);
                            res.redirect("/catalog/manufacturers");
                        }
                    )
                }
            }
        )
    }
};

// Display Manufacturer update form on GET.
exports.manufacturer_update_get = function(req, res, next) {
    
    Manufacturer.findById(req.params.id, function (err, manufacturer) {
        if (err) return next(err);
    
        if (manufacturer == null) {
          const err = new Error("Manufacturer not found");
          err.status = 404;
          return next(err);
        }
    
        res.render("manufacturer_form", {
          title: "Update " + manufacturer.name,
          isUpdating: true,
          manufacturer: manufacturer,
        });
    });
};

// Handle Manufacturer update on POST.
exports.manufacturer_update_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Manufacturer name must be specified."),
    body("description")
        .escape()
        .optional({ checkFalsy: true }),

    (req, res, next) => {
        if(req.body.password != process.env.ADMIN_PASSWORD) {
            let err = new Error("The password you entered is incorrect.");
            err.status = 401;
            return next(err);
        }
        else {
            const errors = validationResult(req);

            var manufacturer = new Manufacturer({
                name: req.body.name,
                description: req.body.description,
                _id: req.params.id,
            });

            if (!errors.isEmpty()) {
                res.render("manufacturer_form", {
                    title: "Update Manufacturer",
                    manufacturer: manufacturer,
                    isUpdating: true,
                    errors: errors.array(),
                });

                return;
            } 
            else {
                Manufacturer.findByIdAndUpdate(
                    req.params.id,
                    manufacturer,
                    {},
                    function (err, themanufacturer) {
                        if (err) return next(err);

                        res.redirect(themanufacturer.url);
                    }
                );
            }
        }
    }
]