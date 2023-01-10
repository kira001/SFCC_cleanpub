'use strict';

var Mail = require('dw/net/Mail');

/**
 * Send contact form data to client
 * @param {Array} sendEmailToAuthor  - The contact Author form data
 * @return void
 */
function sendEmailToAuthor(contactAuthor) {

    var content = contactDetails[contactFirstName] + " " + contactDetails[contactLastName] + " " + contactDetails[contactEmail] + "\n" + contactDetails[contactTopic] + " " + contactDetails[contactComment];

    var mail = new Mail();
    mail.addTo("ecommerce@pippo.online");
    mail.setFrom("noreply@pippo.online");
    mail.setSubject("PIPPO SITE CONTACT FORM");

    mail.setContent(content);
    mail.send();

    return;
}

module.exports = {
    sendEmailAuthor
}