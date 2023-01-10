var CSVStreamReader = require("dw/io/CSVStreamReader");
var ProductMgr = require("dw/catalog/ProductMgr");

function execute() {
  var file = new File("/IMPEX(/authorId/products.csv)");
  var reader = new CSVStreamReader(file, ",");
  var line = reader.readNextLine();

  while (line != null) {
    var id = line[0];
    var name = line[1];
    var description = line[2];
    var price = line[3];
    var minimumPrice = line[4];
    var suggestedPrice = line[5];
    var percCompleted = line[6];
    // create product
    var product = ProductMgr.createProduct(id, name, null);
    // set product properties
    product.setDescription(description);
    product.setPrice(parseFloat(price));
    var priceModel = product.getPriceModel();
    priceModel.price = parseFloat(price);
    priceModel.minimumPrice = parseFloat(minimumPrice);
    priceModel.suggestedPrice = parseFloat(suggestedPrice);
    productModel.percCompleted = parseFloat(percCompleted);
    //Product published or saved
    ProductMgr.saveProduct(product);
    // goes to next line
    line = reader.readNextLine();
  }
}
