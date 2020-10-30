const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
	body('email')
		.isEmail().withMessage('Enter correct email')
		.custom(async (value, { req }) => {
			try {
				const user = await User.findOne({ email: value })
				if (user) {
					return Promise.reject('This email already exists')
				}
			} catch (e) {
				console.log(e)
			}
		})
		.normalizeEmail(),
	body('password', 'Enter correct password. Min 6 symbols, max 56')
		.isLength({ min: 6, max: 56 })
		.isAlphanumeric()
		.trim(),
	body('confirm')
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords must match')
			}
			return true
		})
		.trim(),
	body('name')
		.isLength({ min: 3 })
		.withMessage('The name must be at least 3 symbols')
		.trim()
]

exports.loginValidators = [
	body('email')
		.isEmail().withMessage('Enter correct email'),
	body('password', 'Enter correct password. Min 6 symbols, max 56')
		.isLength({ min: 6, max: 56 })
		.isAlphanumeric()
		.trim()
]

exports.courseValidators = [
	body('title').isLength({ min: 3 }).withMessage('Title min length 3 symbols').trim(),
	body('price').isNumeric().withMessage('Add correct price'),
	body('img', 'Add correct img URL').isURL()
]