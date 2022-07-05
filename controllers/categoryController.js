var Category = require('../models/category');
var Manufacturer = require("../models/manufacturer");
var PcPart = require("../models/pcpart");

const { body, validationResult } = require("express-validator");
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
exports.category_create_get = function(req, res, next) {
    res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post =  [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Category name must be specified"),
    body("description")
        .escape()
        .optional({ checkFalsy: true }),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create category",
                category: req.body,
                isUpdating: false,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid.
            // Create a Category object with escaped and trimmed data.
            var category = new Category({
                title: req.body.title,
                description: req.body.description
            });
            category.save(function (err) {
                if(err) { return next(err) };
                res.redirect(category.url)
            })
        }
    }
]

// Display Category delete form on GET.
exports.category_delete_get = function(req, res, next) {
    
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
        category_parts: function(callback) {
            PcPart.find({ category: req.params.id }).exec(callback)
        }
    },
    function(err, results) {
        if(err) return next(err)

        if(results.category == null) {
            res.redirect("/catalog/categories");
        }

        res.render("category_delete", { 
            title: "Delete Category",
            category: results.category,
            category_parts: results.category_parts
        })
    })
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {

    if(req.body.password != process.env.ADMIN_PASSWORD) {
        let err = new Error("The password you entered is incorrect.");
        err.status = 401;
        return next(err);
    }
    else {
        async.parallel(
            {
                category: function(callback) {
                    Category.findById(req.params.id).exec(callback)
                },
                category_parts: function(callback) {
                    PcPart.find({ "category": req.params.id }).exec(callback)
                }
            },
            function(err, results) {
                if(err) return next(err);

                if(results.category_parts.length > 0) {
                    res.render("category_delete", {
                        title: "Delete Category",
                        category: results.category,
                        category_parts: results.category_parts
                    })
                    return;
                }
                else {
                    Category.findByIdAndRemove(
                        req.body.categoryid, 
                        function deleteCategory(err) {
                            if(err) return next(err);
                            res.redirect("/catalog/categories");
                        }
                    )
                }
            }
        )
    }
};
// Display Category update form on GET.
exports.category_update_get = function(req, res, next) {
    
    Category.findById(req.params.id, function(err, category) {
        if(err) return next(err);

        if(category == null) {
            var err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }

        res.render("category_form", {
            title: "Update category",
            category: category,
            isUpdating: true,
        });
    });
};

// Handle Category update on POST.
exports.category_update_post = [
    
    body("title")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Category title must be specified"),
    body("description")
        .escape()
        .optional({ checkFalsy: true}),

    (req, res, next) => {
        if(req.body.password != process.env.ADMIN_PASSWORD) {
            let err = new Error("The password you entered is incorrect.");
            err.status = 401;
            return next(err);
        }
        else {
            const errors = validationResult(req);

            var category = new Category({
                title: req.body.title,
                description: req.body.description,
                _id: req.params.id
            });

            if(!errors.isEmpty()) {
                res.render("category_form", {
                    title: "Update category",
                    category: category,
                    isUpdating: true,
                    errors: errors.array()
                });
                return;
            }
            else {
                Category.findByIdAndUpdate(
                    req.params.id,
                    category,
                    {},
                    function(err, thecategory) {
                        if(err) return next(err);

                        res.redirect(thecategory.url);
                    }
                )
            }
        }
    }
]