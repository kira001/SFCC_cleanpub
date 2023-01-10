'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');

function getAuthorEmail(authorId) {
    var queryString = "authorId LIKE '".concat(authorId, "*'");
    var searchQuery = CustomObjectMgr.queryCustomObjects('authorId', queryString, null);
    var author = searchQuery.next();
    searchQuery.close();
    return author.emailAuthor;
}

