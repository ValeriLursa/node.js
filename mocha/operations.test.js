//подключение модуля assert для сравнения переменных
const assert = require("node:assert/strict");
var operations = require("./operations")
var stringError = (expectedResult, result) => {return `Expected ${expectedResult}, but got ${result}`};
/*it - функция фреймфорка Mocha.
Принимает два параметра: текстовое описание тестаб по которому его можно идентифицировать, и саму тестирующую функцию */
it("should multiply two numbers", () =>{
    var expectedResult = 16; //какой должен получиться результат
    var result = operations.multiply(3, 5);
    //первый вариант сравнения двух переменных
    // if (result !== expectedResult){
    //     throw new Error(`Expected ${expectedResult}, but got ${result}`);
    // }
    //второй вариант сравнения переменных
    assert.equal(result, expectedResult);
});

it("should add two numbers", () =>{
    var expectedResult = 8; //какой должен получиться результат
    var result = operations.add(3, 5);
    if (result !== expectedResult){
        throw new Error(stringError(expectedResult, result));
    }
});

/*тестирование асинхронный функции
функция done передается для того чтобы асинхронная функция завершилась до завершения теста
если не передать функцию done в тест, тогда тест завершится раньш, чем хавершитс яасинхронная функция*/
it("shouid async multiply two numbers", (done) => {
    var expectedResult = 12;
    operations.multiplyAsync(4, 3, (result) => {
        if (result !== expectedResult) {
            throw new Error(stringError(expectedResult, result));
        }
        done();
    });
});