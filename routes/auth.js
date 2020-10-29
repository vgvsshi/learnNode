const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = Router()
const User = require('../models/user')
const nodemailer = require("nodemailer");
const regEmail = require('../emails/reg');

let testAccount = nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
	service: 'Gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		type: 'OAuth2',
		user: 'idayatovvv@gmail.com',
		clientId: '605024258664-96a30dk7k9ofpbii6miokgtvdckedajs.apps.googleusercontent.com',
		clientSecret: 'N71Y5M7n9ocenyUj4jdXJ7e6',
		refreshToken: '1//041yQMH7LStI6CgYIARAAGAQSNwF-L9IrVT8FLGUUQtWlq0V-j8txb0ciLXwRhZzrEeMdDrOcMEqTzTWyAYrYMaJAAF_-0yivXoo',
		accessToken: 'ya29.A0AfH6SMAqBBZe9Q050_pOOfA8Wz94FG3-Dl0RFi7oBVAPP50S31i79crrB95YN3dmucD2NO5eXkw8t_wGy2G71dGfkgyTE9uKYUX4kilrCgt0nHlRybn_OOCJYzz_2k9IkUnwk9FeL8Kr25PTk2YGa6mLPAaXNpsUulsbsqmdm-Q'
	},
});

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Auth',
		isLogin: true,
		loginError: req.flash('loginError'),
		regError: req.flash('regError')
	})
})

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login/#login');
	})
})

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const candidate = await User.findOne({ email })

		if (candidate) {
			const isSame = await bcrypt.compare(password, candidate.password)
			if (isSame) {
				const user = candidate;
				req.session.user = user
				req.session.isAuthenticated = true
				req.session.save(err => {
					if (err) {
						throw err
					}
					res.redirect('/');
				})
			} else {
				req.flash('loginError', 'Incorrect password')
				res.redirect('/auth/login#login')
			}
		} else {
			req.flash('loginError', 'This user does not exist')
			res.redirect('/auth/login#login')
		}
	} catch (e) {
		console.log(e)
	}
})

router.post('/register', async (req, res) => {
	try {
		const { email, password, confirm, name } = req.body
		const candidate = await User.findOne({ email })

		if (candidate) {
			req.flash('regError', 'User with this email already exists')
			res.redirect('/auth/login#register')
		} else {
			const hashPassword = await bcrypt.hash(password, 10)
			const user = new User({
				email,
				password: hashPassword,
				name,
				cart: { items: [] }
			})
			await user.save()
			await transporter.sendMail(regEmail(email), (err, res) => {
				if (err) {
					console.log(err)
				} else {
					console.log('Email sent')
				}
			});
			res.redirect('/auth/login#login')
		}
	} catch (e) {
		console.log(e)
	}
})

module.exports = router