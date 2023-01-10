'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');

function getAuthorEmail(product) {
    var queryString = "custom.authorId LIKE '".concat(product.custom.authorId, "*'");
    var searchQuery = CustomObjectMgr.queryCustomObjects('authorId', queryString, null);
    var author = searchQuery.next();
    searchQuery.close();
    return author;
}

module.exports = function (object, product) {
    Object.defineProperty(object, 'name', {
        enumerable: true,
        value: product.custom.name
    });
    Object.defineProperty(object, 'email', {
        enumerable: true,
        value: product.custom.email
    });
    Object.defineProperty(object, 'biography', {
        enumerable: true,
        value: product.custom.biography
    });
};