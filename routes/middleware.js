/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const _ = require('lodash');
const keystone = require('keystone');
const CustomText = keystone.list('CustomText');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Menu', key: 'menu', href: '/menu' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Coupons', key: 'coupons', href: '/coupons' },
		{ label: 'Directions', key: 'directions', href: '/directions' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
	];
	res.locals.user = req.user;
	CustomText.model.findOne((err, text) => {
		res.locals.text = text;
		next();
	});
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	const flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


/**
 Prevents people from accessing protected pages when they're not admins
 */
exports.requireAdmin = (req, res, next) => {
	if (!req.user || !req.user.isAdmin) {
		req.flash('error', 'You must be an admin to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
