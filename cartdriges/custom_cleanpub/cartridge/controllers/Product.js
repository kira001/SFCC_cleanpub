"use strict";

var server = require("server");

var cache = require("*/cartridge/scripts/middleware/cache");

var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");

server.extend(module.superModule);

server.replace(
  "Show",
  cache.applyPromotionSensitiveCache,
  consentTracking.consent,
  function (req, res, next) {
    var productHelper = require("~/cartridge/scripts/helpers/productHelpers");

    var minimumPrice = productHelper.minimumPrice(
      showProductPageHelperResult.product
    );
    var authorId = productHelper.authorId(showProductPageHelperResult.product);

    var productReadiness = productHelper.productReadiness(
      showProductPageHelperResult.product
    );

    var suggestedPrice = productHelper.suggestedPrice(
      showProductPageHelperResult.product
    );

    var showProductPageHelperResult = productHelper.showProductPage(
      req.querystring,
      req.pageMetaData
    );

    var productType = showProductPageHelperResult.product.productType;

    if (
      !showProductPageHelperResult.product.online &&
      productType !== "set" &&
      productType !== "bundle"
    ) {
      res.setStatusCode(404);

      res.render("error/notFound");
    } else {
      var pageLookupResult = productHelper.getPageDesignerProductPage(
        showProductPageHelperResult.product
      );

      if (
        (pageLookupResult.page && pageLookupResult.page.hasVisibilityRules()) ||
        pageLookupResult.invisiblePage
      ) {
        res.cachePeriod = 0; // eslint-disable-line no-param-reassign
      }

      if (pageLookupResult.page) {
        res.page(
          pageLookupResult.page.ID,
          {},
          pageLookupResult.aspectAttributes
        );
      } else {
        res.render(showProductPageHelperResult.template, {
          product: showProductPageHelperResult.product,

          addToCartUrl: showProductPageHelperResult.addToCartUrl,

          resources: showProductPageHelperResult.resources,

          breadcrumbs: showProductPageHelperResult.breadcrumbs,

          canonicalUrl: showProductPageHelperResult.canonicalUrl,

          schemaData: showProductPageHelperResult.schemaData,

          productReadiness: showProductPageHelperResult.productReadiness,

          suggestedPrice: showProductPageHelperResult.suggestedPrice,

          authorId: showProductPageHelperResult.authorId,

          minimumPricev: showProductPageHelperResult.minimumPrice,

          contactAuthorURL: showProductPageHelperResult.contactAuthorURL,
        });
      }
    }

    next();
  },
  pageMetaData.computedPageMetaData
);

module.exports = server.exports();
