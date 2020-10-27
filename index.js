const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');

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


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		const url = 'mongodb+srv://vgvsshi:NllK0t7i67NykcLE@cluster0.3lg5l.mongodb.net/shop';
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})
		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`);
		})
	} catch (e) {
		console.log(e)
	}
}

start()

