'use strict';

var Mail = require('dw/net/Mail');


/**
 * Send contact form data to client
 * @param {Array} sendEmailToAuthor  - The contact Author form data
 * @return void
 */
function sendEmailToAuthor(contactAuthor) {

    var mail = new Mail();
    mail.addTo(contactAuthor.authorId);
    mail.setFrom(contactAuthor.contactEmail);
    mail.setSubject("INFORMATION");
    mail.setContent(contactAuthor.contactComment);
    mail.send();

    return;
}

/**
 * Checks if the email value entered is correct format
 * @param {string} email - email string to check if valid
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

module.exports = {
    sendEmailToAuthor,
    validateEmail: validateEmail
}


