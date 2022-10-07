const { response } = require("express");
const express = require("express");
 
const app = express();

/*парсер для данных
объект - результат парсинга будет представлять набор пар ключ-значение,
а каждое значение может быть представлено в виде строки или массив*/
const urlencodedParser = express.urlencoded({extended: false});

var permiss = false;

//start
app.get("/", function(_, response){
    //проверка возраста
    response.sendFile(__dirname+"/age.html");
});

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    //Не работает вывод результата на html через response.send через переменные
    //https://metanit.com/web/nodejs/4.5.php
    if (request.body.userAge > 17) {
        permiss = true;
        response.redirect("index"); 
    }
    else {
        //вывод в консоль на стороне сервера в формате json
        console.log(JSON.stringify(request.body));
        //результат вывода {"userName":"Игорь","userAge":"1"}
        //возвращение страницы с результатом
        response.send('Результат: ' + request.body.userName +' '+ request.body.userAge);
        //результат вывода Результат: Игорь 1
    }
});

//file-css
app.get("/css/navbar.css", (_, response) => response.sendFile(__dirname +"/css/navbar.css"))

//index
app.get("/index", (_, response) => 
    //отправка файла html по адресу /index
    response.sendFile(__dirname+"/index.html"));

//room


//статичные файлы в папке room
app.use("/room", express.static(__dirname+'/room'));

app.get("/room", (_, response) => response.sendFile(__dirname+"/room/room.html"));

//bedroom
//books
// определение Router для books
const bookRouter = express.Router();

//просмотр информации о книге по ее id
bookRouter.get("/:bookId", function (request, response) {
    response.send('bookId: ' + request.params["bookId"])
  });

//обращение к файлу книги
bookRouter.get("/:bookId.:ext", (req, res) =>{
    let bookId = req.params["bookId"];
    let ext = req.params["ext"];
    res.send('Запрошенный файл: ${bookId}.${ext}', bookId, ext)
})

//сопоставление роутер с конечной точкой "/room/bedroom/books"
app.use("/room/bedroom/books", bookRouter);
//bathroom
app.get("/bathroom", (_, response) => response.send("<h1>Ванная</h1>"));

//about
//отправка файла about.html
app.get("/about", (_,response) => response.sendFile(__dirname+"/about.html"));

//*
//обработка статусного кода 404
app.get("*", (_,response) => response.status(404).send('Ресур не найден'));

app.listen(3000, ()=>console.log("Сервер запущен..."));