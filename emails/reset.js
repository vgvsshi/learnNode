const keys = require('../keys');

module.exports = function (email, token) {
	return {
		from: '"Amir 👻" <idayatovvv@.com>',
		to: email,
		subject: "Reset password",
		html: `
			<h1>Forgot your password?</h1>
			<p>If not, please ignore this letter</p>
			<p>Otherwise click on the link</p>
			<p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
			<hr/>
		`,
	}
}