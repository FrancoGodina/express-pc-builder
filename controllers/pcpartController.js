var PcPart = require('../models/pcpart');
var Category = require("../models/category");
var Manufacturer = require('../models/manufacturer');

const { body, validationResult } = require("express-validator");
var async = require("async");

// Display list of all Pcparts.
exports.pcpart_list = function(req, res, next) {
    
    PcPart.find()
        .sort({name : 1})
        .exec(function (err, list_pcparts) {
            if(err) { return next(err); }
            
            res.render("pcpart_list", { title: "PC parts List", pcpart_list: list_pcparts });
        });
};

// Display detail page for a specific Pcpart.
exports.pcpart_detail = function(req, res, next) {
    
    async.parallel({
        pcpart: function(callback) {
            PcPart.findById(req.params.id)
                .populate("manufacturer")
                .populate("category")
                .exec(callback);
        },
    },
        function(err, results) {
            if(err) { return next(err) }

            if(results.pcpart == null) {
                var err = new Error("Part not found")
                err.status = 404
                return next(err)
            }

            res.render("pcpart_detail", {
                title: results.pcpart.title,
                pcpart: results.pcpart,
            })
        }
    )
};

// Display Pcpart create form on GET.
exports.pcpart_create_get = function(req, res, next) {

    async.parallel(
        {
            categories: function(callback) {
                Category.find().exec(callback);
            },
            manufacturers: function(callback) {
                Manufacturer.find().exec(callback);
            }
        },
        function(err, results) {
            if(err) next(err);

            res.render("pcpart_form", {
                title: "Create PC part",
                categories: results.categories,
                manufacturers: results.manufacturers,
                isUpdating: false
            });
        }
    )
};

// Handle Pcpart create on POST.
exports.pcpart_create_post = [
    body("name", "Name must have at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("manufacturer", "Manufacturer must not be empty").trim().escape(),
    body("category", "Category must not be empty").trim().escape(),
    body("description", "Must add at least one feature in the description")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("stock", "Stock can't be lower than 0.").isInt({ min: 0, max: 999}),
    body("price", "Price must be between $0 and $999").isFloat({ min: 0, max: 999 }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        
        var part = new PcPart({
            name: req.body.name,
            description: req.body.description,
            stock: req.body.stock,
            price: req.body.price,
            category: req.body.category,
            manufacturer: req.body.manufacturer
        });

        if (!errors.isEmpty()) {

            async.parallel(
                {
                    categories: function(callback) {
                        Category.find().exec(callback);
                    },
                    manufacturers: function(callback) {
                        Manufacturer.find().exec(callback);
                    },
                },
                function (err, results) {
                    if (err) next(err);
        
                    res.render("pcpart_form", {
                        title: "Create pc part",
                        categories: results.categories,
                        manufacturers: results.manufacturers,
                        part: part,
                        isNew: true,
                        isUpdating: false,
                        errors: errors.array(),
                    });
                }
            );
            return;
        }
        else {
            part.save(function (err) {
                if (err) return next(err);
                res.redirect(part.url);
            });
        }
    },
]

// Display Pcpart delete form on GET.
exports.pcpart_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart delete GET');
};

// Handle Pcpart delete on POST.
exports.pcpart_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart delete POST');
};

// Display Pcpart update form on GET.
exports.pcpart_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart update GET');
};

// Handle Pcpart update on POST.
exports.pcpart_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pcpart update POST');
};