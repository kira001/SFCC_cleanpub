"use strict";

module.exports = function (object, product) {
    Object.defineProperty(object, "minimumPrice", {
        enumerable: true,
        value: //new Money(product.custom.minimumPrice),
    });

    Object.defineProperty(object, "suggestedPrice", {
        enumerable: true,
        value: product.custom.suggestedPrice,
    });
};