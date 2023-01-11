"use strict";

var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

/**
 * Create AVS service
 * @returns {dw.svc.HTTPService} HTTP service object
 */

//creare una funzione per ogni chiamata;
function weTransferAuth (){

}
function weTransferAuth (){
  
}
function weTransferUpload() {
  return LocalServiceRegistry.createService("wetrasfer.service", {
    /**
     * @param {dw.svc.HTTPService} svc
     * @returns {string} request body
     */
    createRequest: function (svc, resource) {

      svc.addHeader("Content-Type", "application/json");
      svc.addHeader("x-api-key", "your_api_key");
      svc.setRequestMethod("POST");
      svc.URL += "authorize";
    },
    /**
     *
     * @param {dw.svc.HTTPService} svc
     * @param {dw.net.HTTPClient} client
     * @returns {{responseObj: Object, isError: boolean, isValidJSON: boolean, errorText: string}}
     */
    parseResponse: function (svc, client) {
      var result = parseResponse(svc, client);
      var token = result.token;
      return token;
    },

    createRequest: function (svc, resource) {
      svc.addHeader("Content-Type", "application/json");
      svc.addHeader("x-api-key", "your_api_key");
      svc.setRequestMethod("POST");
      svc.URL = resource + "transfer";
      svc.addHeader("Authorization", "Bearer " + token);
      svc.description("name", "Created transfer");
    },

    parseResponse: function (svc, client) {
      var result = parseResponse(svc, client);
      if (result.state != "uploading") return;
      var transferId = result.id;
      return transferId;
    },
    createRequest: function (svc, resource) {
      svc.addHeader("Content-Type", "application/json");
      svc.addHeader("x-api-key", "your_api_key");
      svc.setRequestMethod("POST");
      svc.URL = resource + `transfers/${transferId}/items`;
      svc.addHeader("Authorization", "Bearer " + token);
      svc.description("items", [
        {
          local_identifier: "favourite-site",
          filename: "book.zip",
          filesize: 1024,
          content_identifier: "web_content",
        },
      ]);
    },

    parseResponse: function (svc, client) {
      var result = parseResponse(svc, client);

      var objResult = result.item[0];

      if (objResult.id == null) return;

      var infoResponseObject = {
        id: objResult.id,
        partNumber: objResult.meta["multipart_parts"],
        uploadId: objResult.meta["multipart_upload_id"],
      };

      return infoResponseObject;
    },

    createRequest: function (svc, resource) {
      svc.addHeader("Content-Type", "application/json");
      svc.addHeader("x-api-key", "your_api_key");
      svc.setRequestMethod("GET");
      svc.URL =
        resource +
        `/files/${infoResponseObject.id}/uploads/${infoResponseObject.partNumber}/${infoResponseObject.uploadId}`;
      svc.addHeader("Authorization", "Bearer " + token);
    },

    parseResponse: function (svc, client) {
      var result = parseResponse(svc, client);

      if (result["upload_url"] == null) return;

      return result;
    },

    createRequest: function (svc, resource) {
      svc.addHeader("Content-Type", "application/json");
      svc.addHeader("x-api-key", "your_api_key");
      svc.setRequestMethod("POST");
      svc.URL = resource + `/files/${infoResponseObject.id}/uploads/complete`;
      svc.addHeader("Authorization", "Bearer " + token);
    },

    parseResponse: function (svc, client) {
      var result = parseResponse(svc, client);

      if (result["upload_url"] == null) return;

      return result;
    },

    /**
     *
     * @param {dw.svc.HTTPService} svc
     * @param {Address} address
     * @returns {{text: string, statusMessage: string, statusCode: number}}
     */
    mockCall: function () {
      return {
        statusCode: 200,
        statusMessage: "Success",
        text: "",
      };
    },
  });
}




/**
 * Check if response type is JSON
 * @param {dw.net.HTTPClient} client
 * @returns {boolean}
 */
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

module.exports = weTransferUpload();
