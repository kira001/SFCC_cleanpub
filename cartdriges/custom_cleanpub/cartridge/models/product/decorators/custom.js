"use strict";

module.exports = function (object, product) {

  Object.defineProperty(object, "minimumPrice", {
    enumerable: true,
    value: new Money(product.custom.minimumPrice),
  });

  Object.defineProperty(object, "suggestedPrice", {
    enumerable: true,
    value: product.custom.suggestedPrice,
  });

  Object.defineProperty(object, "lastUpdated", {
    enumerable: true,
    value: product.custom.lastUpdated,
  });

  Object.defineProperty(object, "authorId", {
    enumerable: true,
    value: product.custom.authorId,
  });

  Object.defineProperty(object, "productReadiness", {
    enumerable: true,
    value: product.custom.productReadiness,
  });
  
};
