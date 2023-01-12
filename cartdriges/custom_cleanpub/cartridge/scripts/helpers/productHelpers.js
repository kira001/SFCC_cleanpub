"use strict";

var base = module.superModule;

var Locale = require("dw/util/Locale");
var countries = require("*/cartridge/config/countries");

function minimumPrice(product) {
  // var currentLocale = Locale.getLocale(req.locale.id).toString();
  return product.minimumPrice;
}

function suggestedPrice(product) {
  return product.suggestedPrice;
}

function authorId(product) {
  return product.authorId;
}

function productReadiness(product) {
  return product.productReadiness;
}

function URLdownload(product) {
  return product.URLdownload;
}

base.minimumPrice = minimumPrice;
base.authorId = authorId;
base.productReadiness = productReadiness;
base.URLdownload = URLdownload;
base.suggestedPrice = suggestedPrice;

module.exports = base;
