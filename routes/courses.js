const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
	const courses = await Course.find().populate('userId', 'email name')
	res.render('courses', {
		title: 'Courses',
		isCourses: true,
		courses
	})
})

router.get('/:id/edit', async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}

	const course = await Course.findById(req.params.id);

	res.render('courseEdit', {
		title: `Edit ${course.title}`,
		course
	})
})

router.post('/remove', async (req, res) => {
	const { id } = req.body;
	try {
		await Course.deleteOne({ _id: id })
		res.redirect('/courses')
	} catch (e) {
		console.log(e);
	}
})

router.post('/edit', async (req, res) => {
	const { id } = req.body
	delete req.body.id
	await Course.findByIdAndUpdate(id, req.body)
	res.redirect('/courses')
})

router.get('/:id', async (req, res) => {
	const course = await Course.findById(req.params.id);
	res.render('course', {
		layout: 'empty',
		title: `Course ${course.title}`,
		course
	})
})

module.exports = router