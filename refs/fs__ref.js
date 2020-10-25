const fs = require('fs');
const path = require('path');

File system

fs.mkdir(path.join(__dirname, 'notes'), err => {  //mkdir позволяет создать папку, 1 аргумент путь папки, колбек фукнция.
	if (err) throw err;
	console.log('Папка была создана');
});

fs.writeFile(path.join(__dirname, 'notes', 'mynotes.txt'), //writeFile позволяет создать файл, 1 аргумент путь файла, 2 аргумент контект который хотим записать, 3 аргумент колбек с ошибкой
	'Hello world',
	(err) => {
		if (err) throw err;
		console.log('Файл был создан');
		fs.appendFile( 			//позволяет добавить контект к файлу, аргументы такие же, 
			path.join(__dirname, 'notes', 'mynotes.txt'),
			' From append file',
			err => {
				if (err) throw err;
				console.log('Файл был изменен');

				fs.readFile(   		//чтение файла, 1 аргумент путь,2 необязательный это кодировка данных в файле, 3 колбек и ошибкой и данными которые мы читаем
					path.join(__dirname, 'notes', 'mynotes.txt'),
					'utf-8',
					(err, data) => {
						if (err) throw err
						console.log(data);
					}
				)
			}
		)
	}
)

fs.rename(
	path.join(__dirname, 'notes', 'mynotes.txt'),
	path.join(__dirname, 'notes', 'notes.txt'),
	(err) => {
		if (err) throw err;
		console.log('Файл переименован');
	}
)