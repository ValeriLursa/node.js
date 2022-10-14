const request = require("supertest")
const assert = require("node:assert/strict");
var app = require("./app").app;

it ("should return Hello test", (done) => {
    //передача функционала приложения
    request(app)
    //передача маршрута
    .get("/")
    //ожидаемый результат
    .expect("Hello test")
    //запуск выполнения теста
    .end(done);
})

it("should return NotFound with status 404", (done) =>{
    request(app)
    .get("/error")
    .expect(404)
    .expect("NotFound")
    .end(done);
})

it("should return user with name Tom and age 22", (done) => {
    request(app)
    .get("/user")
    .expect( (res) => {
        assert.deepEqual(res.body, {name:"Tom", age: 22});
    })
    .end(done);
});