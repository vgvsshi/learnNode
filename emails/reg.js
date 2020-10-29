module.exports = function (email) {
	return {
		from: '"Fred Foo 👻" <foo@example.com>',
		to: email,
		subject: "Регистрация прошла успешно",
		html: `
			<h1>Добро пожаловать в наш магазин</h1>
			<p>Вы успешно создали аккаунт с email - ${email}</p>
			<hr/>
		`,
	}
}