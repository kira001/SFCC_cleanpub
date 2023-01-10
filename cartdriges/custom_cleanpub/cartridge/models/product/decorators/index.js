'use strict';
 
var sfraProduct = require("base/models/product/decorators/index");
 
module.exports = {
 sfraProduct,
 sustainability: require('*/cartridge/models/product/decorators/sustainability')
}