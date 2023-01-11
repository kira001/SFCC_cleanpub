var Site = require("dw/system/Site");
var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

function createProduct(product) {
  var requestBody;
  var currentSite = Site.getCurrent();
  var token = currentSite.getCustomPreferenceValue("client_id");
  var URL = `https://hostname:port/dw/data/v23_1/products/${product.id}`;

  return LocalServiceRegistry.createService("data.api.create.product", {
    createRequest: function (svc, URL) {
      svc.URL = URL;
      svc.setRequestMethod("PUT");
      svc.addHeader("Authorization", "Bearer" + token);
      requestBody = {
        owning_catalog_id: "WapiCatalog",
        id: product.id,
        title: product.title,
        description: product.description,
        minimumPrice: product.minimumPrice,
        suggestedPrice: product.suggestedPrice,
        readiness: product.readiness,
      };
      return JSON.stringify(requestBody);
    },

    parseResponse: function (svc, client) {
      var result = parseResponse(svc, client);
      return result;
    },
  });
}

function isResponseJSON(client) {
  var contentTypeHeader = client.getResponseHeader("Content-Type");
  return (
    contentTypeHeader &&
    contentTypeHeader.split(";")[0].toLowerCase() === "application/json"
  );
}

/**
 * Parses response JSON and wraps with an object containing additional helper properties
 * @param {dw.svc.HTTPService} svc
 * @param {dw.net.HTTPClient} client
 * @returns {{responseObj: Object, isError: boolean, isValidJSON: boolean, errorText: string}}
 */
function parseResponse(svc, client) {
  var isJSON = isResponseJSON(client);
  var isError = client.statusCode >= 400;
  var parsedBody;

  if (isJSON) {
    try {
      parsedBody = JSON.parse(client.text);
    } catch (e) {
      parsedBody = client.text;
    }
  } else {
    parsedBody = client.text;
  }

  return {
    isValidJSON: isJSON,
    isError: isError,
    responseObj: parsedBody,
    errorText: client.detail,
  };
}

module.exports = createProduct();
