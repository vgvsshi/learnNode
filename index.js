const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express()

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
});

app.engine('handlebars', exphbs({
	handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', 'views')

app.use(async (req, res, next) => {
	try {
		const user = await User.findById('5f983888b25265438cc62ebc')
		req.user = user
		next()
	} catch (e) {
		console.log(e)
	}
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		const url = 'mongodb+srv://vgvsshi:NllK0t7i67NykcLE@cluster0.3lg5l.mongodb.net/shop';
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})
		const candidate = await User.findOne()
		if (!candidate) {
			const user = new User({
				email: 'amiridayatov@mail.ru',
				name: 'Amir',
				cart: { items: [] }
			})
			await user.save();
		}
		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`);
		})
	} catch (e) {
		console.log(e)
	}
}

start()

