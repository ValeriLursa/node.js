const express = require("express");
 
const app = express();

/*парсер для данных
объект - результат парсинга будет представлять набор пар ключ-значение,
а каждое значение может быть представлено в виде строки или массив*/
const urlencodedParser = express.urlencoded({extended: false});

//start
app.get("/", function(_, response){
    //проверка возраста
    response.sendFile(__dirname+"/age.html");
});

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    //Не работает вывод результата на html
    if (request.body.userAge > 17) response.redirect("index"); else response.send("${request.body.userName} - ${request.body.userAge}<br><h1>Доступ закрыт, прости<h1>");
});

//index
app.get("/index", function(_, response){
    //отправка файла html по адресу /
    response.sendFile(__dirname+"/index.html");
});

//room
//статичные файлы в папке room
app.use("/room", express.static(__dirname+'/room'));

app.get("/room", function(_, response){
     
    response.send("<h1>Комната</h1>");
});

//bathroom
app.get("/bathroom", function(_, response){
     
    response.send("<h1>Ванная</h1>");
});

//about
//отправка файла about.html
app.get("/about", function(_,response){
    response.sendFile(__dirname+"/about.html");
});

//*
//обработка статусного кода 404
app.get("*", function(_,response){
    response.status(404).send('Ресур не найден');
});

app.listen(3000, ()=>console.log("Сервер запущен..."));