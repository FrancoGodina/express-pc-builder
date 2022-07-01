#! /usr/bin/env node

console.log('This script populates some pc parts, manufacturers and categories to your database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var PcPart = require('./models/pcpart')
var Manufacturer = require('./models/manufacturer')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var pcparts = []
var manufacturers = []
var categories = []

function categoryCreate(title, description, cb) {
    categorydetail = { title: title };
    if (description != false) categorydetail.description = description;

    var category = new Category(categorydetail);

    category.save(function(err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New Category: " + category);
        categories.push(category);
        cb(null, category);
    });
}


function manufacturerCreate(name, description, cb) {
    manufacturerdetail = {name: name};
    if(description != false) manufacturerdetail.description = description;

    var manufacturer = new Manufacturer(manufacturerdetail);

    manufacturer.save(function(err) { 
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New manufacturer: " + manufacturer);
        manufacturers.push(manufacturer);
        cb(null, manufacturer);
    });
}

function pcPartCreate(name, manufacturer, category, description, stock, price, cb) {
    var pcPart = new PcPart ({
      name: name,
      manufacturer: manufacturer,
      category: category,
      description: description,
      stock: stock,
      price: price
    });
  
    pcPart.save(function(err) {
      if(err) {
          cb(err, null);
          return;
      }
      console.log("New pc part" + pcPart);
      pcparts.push(pcPart);
      cb(null, pcPart);
    });
}

// Create parts, manufacturers and categories

function createCategories(cb) {
    async.parallel(
        [
            function(callback) {
                categoryCreate(
                    "CPU",
                    "A Central Processing Unit (CPU) is the brain of the computer. This is what runs all your programs, calculations, and operations.",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "CPU Cooler",
                    "A heatsink and fan (HSF), also known as a CPU Cooler, sits atop the CPU to draw heat away from the CPU and disperse it, because CPUs produce heat while operating. Most CPUs will come with a free “stock” HSF, but if you buy a CPU that comes without a cooler and/or if you plan to overclock your CPU, you will need to buy an “aftermarket” HSF.",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Motherboard",
                    "The motherboard electronically connects all of your PC’s parts. It also takes power from the PSU and provides it to many of your other components.",
                    callback
                );
            },
        ],
        cb
    )
}

function createManufacturers(cb) {
    async.parallel(
        [
            function(callback) {
                manufacturerCreate(
                    "AMD",
                    "AMD is an American multinational semiconductor company based in Santa Clara, California, that develops computer processors and related technologies for business and consumer markets. AMD's main products include microprocessors, motherboard chipsets, embedded processors, graphics processors, and FPGAs for servers, workstations, personal computers, and embedded system applications.",
                    callback
                );
            },
            function(callback) {
                manufacturerCreate(
                    "NVIDIA",
                    "NVIDIA is an American multinational technology company incorporated in Delaware and based in Santa Clara, California. It is a software and fabless company which designs graphics processing units (GPUs), application programming interface (APIs) for data science and high-performance computing as well as system on a chip units (SoCs) for the mobile computing and automotive market. Nvidia is a global leader in artificial intelligence hardware & software from edge to cloud computing and expanded its presence in the gaming industry with its handheld game consoles Shield Portable, Shield Tablet, and Shield Android TV and its cloud gaming service GeForce Now. Its professional line of GPUs are used in workstations for applications in such fields as architecture, engineering and construction, media and entertainment, automotive, scientific research, and manufacturing design.",
                    callback
                );
            },
            function(callback) {
                manufacturerCreate(
                    "INTEL",
                    "Intel Corporation is an American multinational corporation and technology company headquartered in Santa Clara, California. It is the world's largest semiconductor chip manufacturer by revenue, and is the developer of the x86 series of microprocessors, the processors found in most personal computers (PCs). Incorporated in Delaware, Intel ranked No. 45 in the 2020 Fortune 500 list of the largest United States corporations by total revenue for nearly a decade, from 2007 to 2016 fiscal years.",
                    callback
                );
            },
        ],
        cb
    );
}

function createParts(cb) {
    async.parallel(
        [
            function(callback) {
                pcPartCreate(
                    "MICRO AMD RYZEN 9 5950X",
                    manufacturers[0],
                    categories[0],
                    "Key to desktop performance, you no longer have to think about how to allocate time and actions: now all tasks are possible simultaneously.",
                    19,
                    543,
                    callback
                );
            },
        ],
        cb
    );
}

async.series([
    createCategories, createManufacturers, createParts 
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Components: ' + pcparts);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});