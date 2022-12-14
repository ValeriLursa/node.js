const { response } = require("express");
const express = require("express");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
const app = express();

//файлы
const fs = require("fs");
const jsonParser = express.json(); // для извелечения данных из запроса
const filePath = "books.json";

//база данных
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
const mongoClient = new MongoClient("mongodb://localhost:27017/");
let dbClient;

//база данных через mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//статус сервера базы данных
let statusDB = false;

//подключение к базе данных
async function run(statusDB) {
    if (statusDB) {
        try {
            await mongoClient.connect();
            console.log("Подключение к серверу базы данных успешно");
            app.locals.collection = mongoClient.db("books_db").collection("books");
            const countDocumentDB = await app.locals.collection.countDocuments();
            if (countDocumentDB == 0) {
                console.log("Запуск добавления документов в базу данных")
                await setBooksDB(app.locals.collection);
            }
        }
        catch (err) {
            console.log("Возникла ошибка");
            console.log(err);
        }
    }
    app.listen(3000, () => {
        console.log("Сервер запущен...");
    });
}

// run(statusDB);

async function setBooksDB(collection) {
    var expectedArray = [
        { id: 1, author: 'Boris Vian', name: 'L’Écume des jours' },
        { id: 2, author: 'Franz Kafka', name: 'Die Verwandlung' },
        { id: 3, author: 'Kōbō Abe', name: 'Kangaroo Notebook' }
    ];
    const resultInsertMany = await collection.insertMany(expectedArray);
    console.log("Добавление нескольких книг успешно");
    return;
}

//подключение к базе данных через mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", { useUnifiedTopology: true, useNewUrlParser: true }, function (err) {
    if (err) return console.log(err);
    app.listen(3000, function () {
        console.log("Сервер ожидает подключения...");
    });
    console.log("Подключение к бд есть");
});

/*парсер для данных
объект - результат парсинга будет представлять набор пар ключ-значение,
а каждое значение может быть представлено в виде строки или массива*/
const urlencodedParser = express.urlencoded({ extended: false });

// устанавка настроек для файлов layout
app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
))

/*
Установка Handelebars в качестве движка представления в Express
*/
app.set("view engine", "hbs");
//Настройка фукнционала частичных представлений
hbs.registerPartials(__dirname + "/views/partials");

//start
app.get("/", function (_, response) {
    //проверка возраста
    response.sendFile(__dirname + "/age.html");
});

// app.post("/", urlencodedParser, function (request, response) {
//     if (!request.body) return response.sendStatus(400);
//     //Не работает вывод результата на html через response.send через переменные
//     //https://metanit.com/web/nodejs/4.5.php
//     if (request.body.userAge > 17) {
//         permiss = true;
//         response.redirect("index");
//     }
//     else {
//         //вывод в консоль на стороне сервера в формате json
//         console.log(JSON.stringify(request.body));
//         //результат вывода {"userName":"Игорь","userAge":"1"}
//         //возвращение страницы с результатом
//         response.send('Результат: ' + request.body.userName + ' ' + request.body.userAge);
//         //результат вывода Результат: Игорь 1
//     }
// });

//проверка возраста через mongooste
const userScheme = new Schema({ name: String, age: Number }, { versionKey: false });
const User = mongoose.model("User", userScheme);

function creatUser() {
    User.create({ name: "Alice", age: 34 }, (err, doc) => {
        disconnectMongoos();
        if (err) return console.log(err);
        console.log("Сохранен объект user", doc);
    });
}

function disconnectMongoos() {
    mongoose.disconnect();
}

// creatUser();
app.post("/", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const userName = req.body.name;
    console.log(req.body);
    const userAge = req.body.age;

    const filter = { name: userName };
    // mongoose.connect("mongodb://localhost:27017/usersdb", { useUnifiedTopology: true, useNewUrlParser: true }, function (err) {
    //     if (err) return console.log(err);
    // });
    User.findOne(filter, (err, doc) => {
        if (err) { 
            console.log(err);
        }
        console.log(doc);
        if (doc == null){
            res.send("Такого пользователя нет");
            return;
        }
        if (userAge != doc.age) {
            console.log("Несовпадение возраста");
            res.send(false);
            return;
        }
        console.log("Совпадение успешно");
        res.send(doc);
    });
})


//file-css
app.get(["/navbar.css", "/room/navbar.css"], (_, response) => response.sendFile(__dirname + "/css/navbar.css"))
app.get("/footer.css", (_, response) => response.sendFile(__dirname + "/css/footer.css"))

//index
app.get("/index", (_, response) =>
    //отправка файла html по адресу /index
    response.sendFile(__dirname + "/index.html"));

//room
//статичные файлы в папке room
app.use("/room", express.static(__dirname + '/room'));
app.use("/room/bedroom", (_, res) => res.redirect("/room/bedroom.html"));

app.get("/room", (_, response) => response.sendFile(__dirname + "/room/room.html"));

//bedroom
//books
// определение Router для books
const bookRouter = express.Router();

//просмотр информации о книге по ее id
bookRouter.get("/:bookId", function (request, response) {
    response.send('bookId: ' + request.params["bookId"]);
});

//обращение к файлу книги
bookRouter.get("/:bookId.:ext", (req, res) => {
    let bookId = req.params["bookId"];
    let ext = req.params["ext"];
    res.send('Запрошенный файл: ${bookId}.${ext}', bookId, ext)
})

//сопоставление роутер с конечной точкой "/room/bedroom/books"
app.use("/room/bedroom/books", bookRouter);

//api в стиле REST для взаимодействия с пользователем
//работа с библиотекой
//вывод всех книг
app.get("/api/books", function (req, res) {
    if (!statusDB) {
        // запрос данных с файла json
        const content = fs.readFileSync(filePath, "utf8");
        const books = JSON.parse(content);
        res.send(books);
    }
    else {
        //запрос данных с базы данных
        const collection = req.app.locals.collection;
        collection.find().toArray((err, books) => {
            if (err) console.log(err);
            res.send(books);
        });
    }
});

//получение одной книги по ее id
app.get("/api/books/:id", (req, res) => {
    const id = req.params.id; //получаем id
    const content = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(content);
    let book = null;
    //поиск в массиве книгу по id
    books.forEach(bookFor => {
        if (bookFor.id == id) {
            book = bookFor;
        }
    });
    //возврат книги
    if (book) res.send(book);
    else res.status(404).send('Такой книги нет');
    //else res.send('');
})

//получение отправленных данных, добавление новой книги
app.post("/api/books", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const authorBook = req.body.author;
    const nameBook = req.body.name;
    let book = { author: authorBook, name: nameBook };

    let data = fs.readFileSync(filePath, "utf8");
    let books = JSON.parse(data);
    //поиск максимального id в базе
    const id = Math.max.apply(null, books.map(function (o) { return o.id; }));
    //увеличение id на 1
    book.id = id + 1;
    //добавление книги в массив
    books.push(book);
    data = JSON.stringify(books);
    //перезаписывание файла json с новой книгой
    fs.writeFileSync("books.json", data);
    res.send(book);
})

//удаление книги по id
app.delete("/api/books/:id", (req, res) => {
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let books = JSON.parse(data);
    let index = -1;
    //поиск индекса книги в массиве
    books.forEach(bookFor => {
        if (bookFor.id == id) {
            index = id - 1;
        }
    });

    if (index > -1) {
        //удаление книги из массива по индексу
        const book = books.splice(index, 1)[0];
        data = JSON.stringify(books);
        fs.writeFileSync(filePath, data);
        //возврат удаленного пользователя
        res.send(book);
    }
    else res.status(404).send();
})

function cl(a) {
    console.log(a);
}

//изменение данных книги
app.put("/api/books", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const idBook = req.body.id;
    const authorBook = req.body.author;
    const nameBook = req.body.name;

    let data = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(data);
    let book;

    books.forEach(bookFor => {
        if (bookFor.id == idBook) {
            book = bookFor;
        }
    })
    // for(var i=0; i<books.length; i++){
    //     if(books[i].id==idBook){
    //         book = books[i];
    //         break;
    //     }
    // }

    //изменение данных книги
    if (book) {
        book.author = authorBook;
        book.name = nameBook;
        data = JSON.stringify(books);
        fs.writeFileSync(filePath, data);
        res.send(book);
    }
    else {
        res.status(404).send(book);
    }
})

//bathroom
app.get("/bathroom", (_, response) => response.send("<h1>Ванная</h1>"));

//представления
//about
app.get("/about", (_, response) => {
    //отправка файла about.html
    //response.sendFile(__dirname+"/about.html");

    //отправка модели представления на место шаблона
    /*производится рендеринг представления "about.hbs" с помощью функции response.render().
    На основе представления функция создает страницу html, которая отправляется клиенту*/
    response.render("about", {
        title: "Информация обо мне",
    });
});

//contact
app.get("/contact", (_, res) => {
    res.render("contact", {
        title: "Контактные данные",
        email: "kve8@mail.ru",
        phone: "8(987)654-32-10"
    })
})
//---

//*
//обработка статусного кода 404
app.get("*", (_, response) => response.status(404).send('Ресур не найден'));

process.on("SIGINT", () => {
    dbClient.close();
    mongoose.disconnect();
    process.exit();
});

module.exports.app = app;