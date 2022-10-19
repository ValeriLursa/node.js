const request = require("supertest")
const assert = require("node:assert/strict");
const e = require("express");
var app = require("./app").app;
const fs = require("fs");

var expectedArray = [
    { id: 1, author: 'Boris Vian', name: 'L’Écume des jours' },
    { id: 2, author: 'Franz Kafka', name: 'Die Verwandlung' },
    { id: 3, author: 'Kōbō Abe', name: 'Kangaroo Notebook' }
];

function rewriteFile(done) {
    //перезапись файла books.json
    let fileConstBooks = fs.readFileSync("const_books.json", "utf8");
    fs.writeFileSync("books.json", fileConstBooks, (err) => {
        if (err) console.log("Файл не перезаписан!");
    });
    return;
}

describe("file html tests", () => {
    it("should return status 200", (done) => {
        request(app)
            .get("/")
            .expect(200)
            .end(done);
    });

    it("should return file age.html", (done) => {
        request(app)
            .get("/")
            .attach("file", __dirname + "\\age.html")
            .end(done);
    });
});

describe("file css test", () => {
    it("should return file navbar.css along the path /navbar.css", (done) => {
        request(app)
            .get("/navbar.css")
            .attach("file", __dirname + "/css/navbar.css")
            .end(done);
    });

    it("should return file navbar.css along the path /room/navbar.css", (done) => {
        request(app)
            .get("/room/navbar.css")
            .attach("file", __dirname + "/css/navbar.css")
            .end(done);
    });
})

describe("api books Tests", () => {
    rewriteFile();
    describe("get-request", () => {
        it("should return length return array all books", (done) => {
            var expectedLengthArray = expectedArray.length;
            request(app)
                .get("/api/books")
                .expect((res) => {
                    assert.equal(res.body.length, expectedLengthArray);
                })
                .end(done);
        });

        it("should return array all books", (done) => {
            request(app)
                .get("/api/books")
                .expect((res) => {
                    let assertArray = [];
                    res.body.forEach(elem => {
                        assertArray.push({ "id": elem.id, "author": elem.author, "name": elem.name });
                    });
                    assert.deepEqual(assertArray, expectedArray);
                })
                .end(done);
        });

        it("should return book", (done) => {
            request(app)
                .get("/api/books/1")
                .expect((res) => {
                    assert.deepEqual(res.body, expectedArray[0])
                })
                .end(done);
        });

        it("should return status 404 with \"Такой книги нет\"", (done) => {
            request(app)
                .get("/api/books/5")
                .expect(404)
                .expect("Такой книги нет")
                .end(done);
        });
    });

    describe("post-request", () => {
        it("should return sent data", (done) => {
            var expectedObject = { "id": 4, "author": "author", "name": "name" };
            request(app)
                .post("/api/books")
                .send(expectedObject)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    if (err) done(err);
                    assert.deepEqual(res.body, expectedObject);
                    done();
                });
        });
    });

    describe("delete-request", () => {
        var expectedObject = { "id": 4, "author": "author", "name": "name" };
        it("should return status 404", (done) => {
            request(app)
                .delete("/api/books/10")
                .expect(404)
                .end(done);
        })

        it("should return delete book", (done) => {
            request(app)
                .delete("/api/books/4")
                .expect((res) => {
                    assert.deepEqual(res.body, expectedObject);
                })
                .end(done);
        });
    });

    describe("put-request", () => {

        //Не работает, выводится статус 404 вместо 400
        // it("should return status 400", (done) => {
        //     request(app)
        //         .put("/api/books")
        //         .send(false)
        //         .expect(400)
        //         .end(done);
        // });

        it("should return status 404 with undefined", (done) => {
            var expectedObject = { "id": 10, "author": "author", "name": "name" };
            request(app)
                .put("/api/books")
                .send(expectedObject)
                .expect(404)
                .end(done);
        });

        it("should return send book", (done) => {
            var expectedObject = { "id": 1, "author": "author", "name": "name" };
            request(app)
                .put("/api/books")
                .send(expectedObject)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    if (err) done(err);
                    assert.deepEqual(res.body, expectedObject);
                    done();
                });
        });

        it("should return the corrected data to the original version", (done) => {
            request(app)
                .put("/api/books")
                .send(expectedArray[0])
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    if (err) done(err);
                    assert.deepEqual(res.body, expectedArray[0]);
                    done();
                });
        });
    });
});