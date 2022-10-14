//Экспортированный модуль для умножения двух чисел
module.exports.multiply = (x, y) => {return x*y};
//Экспортированный модуль для сложения
module.exports.add = (x, y) => {return x + y;};
//Экспортированный асинхронный модуль
module.exports.multiplyAsync = (a, b, callback) => {
    setTimeout(() => callback(a * b), 1000)
}