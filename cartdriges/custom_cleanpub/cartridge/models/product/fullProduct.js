'use strict';

var decorators = require('*/cartridge/models/product/decorators/index');

var base = module.superModule;

module.exports = function fullProduct(product, apiProduct, options) {
    base.call(product, apiProduct, options);
    decorators.infoAuthor(product, apiProduct);
    return product;
}