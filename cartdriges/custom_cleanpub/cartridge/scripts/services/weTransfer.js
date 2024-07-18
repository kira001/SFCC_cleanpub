"use strict";

var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

function reqAuth(svc, resource) {
  svc.addHeader("Content-Type", "application/json");
  svc.addHeader("x-api-key", "your_api_key");
  svc.setRequestMethod("POST");
  svc.URL += "authorize";
}

function resAuth(svc, client) {
  var result = parseResponse(svc, client);
  var token = result.token;
  return token;
}

var authService = LocalServiceRegistry.createService("MyFTPService", {
  createRequest: function (svc, resource) {
    reqAuth(svc, resource);
  },

  parseResponse: function (svc, client) {
    reqAuth(svc, client);
  },
});

function reqAddItem(svc, resource, token) {
  svc.addHeader("Content-Type", "application/json");
  svc.addHeader("x-api-key", "your_api_key");
  svc.setRequestMethod("POST");
  svc.URL = resource + "transfers";
  svc.addHeader("Authorization", "Bearer " + token);
  svc.description("name", "Created transfer");
}

function resAddItem(svc, client) {
  var result = parseResponse(svc, client);
  if (client.state != "200") throw err;
  return result;
}

var transferService = LocalServiceRegistry.createService("MyFTPService", {
  createRequest: function (svc, resource) {
    reqAddItem(svc, resource);
  },

  parseResponse: function (svc, client) {
    resAddItem(svc, client);
  },
});

function reqTransfer(svc, resource, token, result) {
  svc.addHeader("Content-Type", "application/json");
  svc.addHeader("x-api-key", "your_api_key");
  svc.setRequestMethod("POST");
  svc.URL = resource + `transfers/${result.id}/items`;
  svc.addHeader("Authorization", "Bearer " + token);
  svc.description("items", [
    {
      local_identifier: "favourite-site",
      filename: "book.zip",
      filesize: 1024,
      content_identifier: "web_content",
    },
  ]);
}

function resTransfer(svc, client) {
  var result = parseResponse(svc, client);
  var objResult = result.item[0];
  if (objResult.id == null) return;
  var infoResponseObject = {
    id: objResult.id,
    partNumber: objResult.meta["multipart_parts"],
    uploadId: objResult.meta["multipart_upload_id"],
  };

  return infoResponseObject;
}

var addItemService = LocalServiceRegistry.createService("MyFTPService", {
  createRequest: function (svc, resource, token, result) {
    reqTransfer(svc, resource, token, result);
  },

  parseResponse: function (svc, client) {
    resTransfer(svc, client);
  },
});

function reqUpload(svc, resource, infoResponseObject) {
  svc.addHeader("Content-Type", "application/json");
  svc.addHeader("x-api-key", "your_api_key");
  svc.setRequestMethod("GET");
  svc.URL =
    resource +
    `/files/${infoResponseObject.id}/uploads/${infoResponseObject.partNumber}/${infoResponseObject.uploadId}`;
  svc.addHeader("Authorization", "Bearer " + token);
}

function resUpload(svc, client) {
  var result = parseResponse(svc, client);
  if (result["upload_url"] == null) return;
  return result;
}

var requestUploadService = LocalServiceRegistry.createService("MyFTPService", {
  createRequest: function (svc, resource, infoResponseObject) {
    reqTransfer(svc, resource, infoResponseObject);
  },

  parseResponse: function (svc, client) {
    resTransfer(svc, client);
  },
});

function reqComplete(svc, resource, infoResponseObject) {
  svc.addHeader("Content-Type", "application/json");
  svc.addHeader("x-api-key", "your_api_key");
  svc.setRequestMethod("POST");
  svc.URL = resource + `/files/${infoResponseObject.id}/uploads/complete`;
  svc.addHeader("Authorization", "Bearer " + token);
}

function resComplete(svc, client) {
  var result = parseResponse(svc, client);
  if (result["upload_url"] == null) return;
  return result;
}

var completeUploadService = LocalServiceRegistry.createService("MyFTPService", {
  createRequest: function (svc, resource, infoResponseObject) {
    reqTransfer(svc, resource, infoResponseObject);
  },

  parseResponse: function (svc, client) {
    resTransfer(svc, client);
  },
});

function execute() {
  let urlFile = "";
  authService.callService().then(function (token) {
    transferService.callService(token).then(function (token, result) {
      urlFile = result[shortened_url];
      addItemService
        .callService(token, result)
        .then(function (infoResponseObject) {
          requestUploadService
            .callService(token, result)
            .then(function (infoResponseObject) {
              completeUploadService.callService(infoResponseObject);
            });
        });
    });
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
