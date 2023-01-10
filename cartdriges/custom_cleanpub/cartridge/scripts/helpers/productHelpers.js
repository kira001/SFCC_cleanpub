'use strict';

var base = module.superModule;

var Locale = require('dw/util/Locale');
var countries = require('*/cartridge/config/countries');

function convertco2value(product) {
    var currentLocale = Locale.getLocale(req.locale.id).toString();

    var convertedCo2Value = "";

    countries.forEach(function (locale) {
        if (currentLocale === locale.id) {
            switch (locale.weight) {
                case "kg.":
                    convertedCo2Value += product.custom.co2Saved + locale.weight;
                    break;
                case "lb.":
                    convertedCo2Value += (product.custom.co2Saved / 2.205).toStr() + locale.weight;
                    break;
                // Cina
                // case "Jin":
                //     convertedCo2Value
                //     break;
                // Giappone
                // case "Monme":
                //     convertedCo2Value
                //     break;
                default:
                    convertedCo2Value = "N/A";
                    break;
            }

            return convertedCo2Value;
        }
    });
}

function sustainabilityColor(product) {
    if (product.custom.co2Saved > 5 && product.custom.biodegradability > 90) {
        return "sustanibilityColorGreen";
    } else if (product.custom.co2Saved < 5 || product.custom.biodegradability < 90) {
        return "sustanibilityColorLightGreen";
    } else {
        return "sustanibilityColorOrange";
    }
}


base.convertco2value = convertco2value;
base.sustainabilityColor = sustainabilityColor;

module.exports = base;