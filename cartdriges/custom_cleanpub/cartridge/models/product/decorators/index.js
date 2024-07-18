'use strict';

var sfraProduct = require("base/models/product/decorators/index");

module.exports = {
    sfraProduct,
    custom: require('*/cartridge/models/product/decorators/custom')
}