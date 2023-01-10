'use strict';

module.exports = function (object, product) {

    Object.defineProperty(object, 'biodegradability', {
        enumerable: true,
        value:  product.custom.biodegradability
    });

    Object.defineProperty(object, 'co2Saved', {
        enumerable: true,
        value: product.custom.co2Saved
    });
};