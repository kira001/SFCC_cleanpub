'use strict';

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.extend(module.superModule);

/**
 * ContactUs-Landing : This endpoint is called to load contact us landing page
 * @name Base/emailAuthor-ShowForm
 * @function
 * @memberof ContactUs
 * @param {middleware} - server.middleware.https
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('ShowForm', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    res.render('../template/default/emailFormAuthor.isml', {
        actionUrl: URLUtils.url('emailAuthor-SendEmail').toString(),
        authorId: req.querystring.authorId
    });
    next();
});

/**
 * ContactUs-Subscribe : This endpoint is called to submit the shopper's contact information
 * @name Base/ContactUs-Subscribe
 * @function
 * @memberof ContactUs
 * @param {middleware} - server.middleware.https
 * @param {httpparameter} - contactFirstName - First Name of the shopper
 * @param {httpparameter} - contactLastName - Last Name of the shopper
 * @param {httpparameter} - contactEmail - Email of the shopper
 * @param {httpparameter} - contactTopic - ID of the "Contact Us" topic
 * @param {httpparameter} - contactComment - Comments entered by the shopper
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.post('SendEmail', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var HookManager = require('dw/system/HookMgr');
    var emailHelper = require('*/cartridge/scripts/helpers/emailHelpers');
    var myForm = req.form;
    var isValidEmailid = emailHelper.validateEmail(myForm.contactEmail);
    if (isValidEmailid) {
        var contactDetails = [myForm.authorId, myForm.contactEmail, myForm.contactComment];
        HookManager.callHook('app.sendEmailToAuthor', 'sendEmailToAuthor', contactDetails);
        res.json({
            success: true,
            msg: Resource.msg('subscribe.to.contact.us.success', 'contactUs', null)
        });
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.to.contact.us.email.invalid', 'contactUs', null)
        });
    }

    next();
});


module.exports = server.exports();