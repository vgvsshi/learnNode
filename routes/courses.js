const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
	try {
		const courses = await Course.find().populate('userId', 'email name')
		res.render('courses', {
			title: 'Courses',
			isCourses: true,
			userId: req.user ? req.user._id.toString() : null,
			courses
		})
	} catch (e) {
		console.log(e)
	}
})

router.get('/:id/edit', auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}

	try {
		const course = await Course.findById(req.params.id);

		if (course.userId.toString() !== req.user._id.toString()) {
			return res.redirect('/courses')
		}
		res.render('courseEdit', {
			title: `Edit ${course.title}`,
			course
		})
	} catch (e) {
		console.log(e)
	}
})

router.post('/remove', auth, async (req, res) => {
	const { id } = req.body;
	try {
		await Course.deleteOne({
			_id: id,
			userId: req.user._id
		})
		res.redirect('/courses')
	} catch (e) {
		console.log(e);
	}
})

router.post('/edit', auth, async (req, res) => {
	try {
		const { id } = req.body
		delete req.body.id
		const course = await Course.findById(id);
		if (course.userId.toString() !== req.user._id.toString()) {
			return res.redirect('/courses')
		}
		await Course.findByIdAndUpdate(id, req.body)
		res.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

router.get('/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);
		res.render('course', {
			layout: 'empty',
			title: `Course ${course.title}`,
			course
		})
	} catch (e) {
		console.log(e)
	}
})

module.exports = router