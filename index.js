const express = require('express');
const path = require('path');
const csurf = require('csurf');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user')
const keys = require('./keys')



const app = express()

const store = new MongoStore({
	collection: 'sessions',
	uri: keys.MONGODB_URI
})

app.engine('handlebars', exphbs({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	helpers: {
		if1: function (a, b, options) {
			if (a == b) {
				return options.fn(this)
			}
			return options.inverse(this)
		}
	},
	defaultLayout: 'main',
	extname: 'handlebars',
}));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views/')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
	secret: keys.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store
}))
app.use(csurf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)


app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await mongoose.connect(keys.MONGODB_URI, {
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

