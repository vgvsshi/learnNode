const path = require('path');


console.log(__filename); //путь до файла
console.log(path.basename(__filename)); //метод basename ползволяет получить название файла
console.log(path.dirname(__filename)); //метод dirname позволяет получить путь до ПАПКИ
console.log(path.extname(__filename)); //метод extname позволяет получить расширение файла
console.log(path.parse(__filename)); //метод parse позволяет получить filename в качеству объекта, в котором будет содержаться путь до папки, название файла, расширение и тд.
console.log(path.join(__dirname, 'test', 'second.html'));// генерация путь
console.log(path.resolve(__dirname, './test', 'second.html'))// тоже генерация, но можно указывать относительный и абсолютный путь
