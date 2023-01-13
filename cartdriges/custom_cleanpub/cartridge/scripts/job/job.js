var CSVStreamReader = require("dw/io/CSVStreamReader");
var ProductMgr = require("dw/catalog/ProductMgr");
var SFTPClient = require("dw/net/SFTPClient");

function execute() {
  var file = new File("/IMPEX(/authorId/products.csv)");
  var reader = new CSVStreamReader(file, ",");
  var line = reader.readNext();

  SFTPClient.connect("my.sftp-server.com", "username", "password");

  SFTPClient.mkdir("SFTP/fullproduct")
  SFTPClient.mkdir("SFTP/update");

  SFTPClient.disconnect();
  //lista --> reader.readAll()

  while (line.asNext()) {
    var id = line[0];
    var name = line[1];
    var description = line[2];
    var price = line[3];
    var minimumPrice = line[4];
    var suggestedPrice = line[5];
    var percCompleted = line[6];
    // create product

    // PUT https://hostname:port/dw/data/v23_1/products/{id}

    // goes to next line
    line = reader.readNext();
  }
}
