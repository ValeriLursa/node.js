//Ключевой класс для работы с MongoDB
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";

//подключение к серверу бд
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

//синхронное подключение
// //client - ссылка на подключенный к серверу клиент

//не работает, сигнатура ниже устарела
// mongoClient.connect((err, client) => {
//     if (err) {
//         return console.log(err);
//     }

//     //обращение к базе данных admin
//     const db = client.db("admin");
//     //Проведение диагностики базы данных
//     //ping: 1 - проверка подключения к базе данных
//     db.command({ ping: 1 }, (err, result) => {
//         if (!err){
//             console.log("Подключение к базе данных успешно");
//             console.log(result);
//         }
//         //Закрытие подключения
//         // client.close();

//     })
//     //отключение соединения
//     client.close();
//     console.log("Подключение к серверу отключено");
// })

//подключение с использованием async/await

async function run() {
    try {
        //Подключение к серверу
        await mongoClient.connect()

        //Взаимодействие с базой данных
        //обращение к базе данных admin
        //Если базы данных с таким именем нет, то сервер создаст ее автоматически
        const db = mongoClient.db("admin");
        //Проведение диагностики базы данных
        //ping: 1 - проверка подключения к базе данных
        const resultCommand = await db.command({ ping: 1 });
        console.log("Подключение с базой данных успешно установлено");
        console.log(resultCommand); // -> { ok: 1 }


        //Если коллекции в базе данных нет, то сервер создаст ее автоматически
        const collection = db.collection("users");

        //Добавление документа
        let user = { name: "Tom", age: 23 };
        let resultInsertOne = await collection.insertOne(user);
        console.log("Добавление документа успешно");
        console.log(resultInsertOne); // -> {
                                        //     acknowledged: true,
                                        //     insertedId: new ObjectId("634d2e175198c8ab938681ba")
                                        //   }
        //_id - уникальный идентификатор документа, который присваивается сервером при добавлении
        console.log(user); // -> { name: 'Tom', age: 23, _id: new ObjectId("634d2e175198c8ab938681ba") }

        //Добавление нескольких документов
        let users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];
        resultInsertOne = await collection.insertMany(users);
        console.log("Добавление нескольких документов успешно");
        console.log(resultInsertOne); // ->{
                                        //     acknowledged: true,
                                        //     insertedCount: 3,
                                        //     insertedIds: {
                                        //       '0': new ObjectId("634d2fe90168eeefc15d7d9e"),
                                        //       '1': new ObjectId("634d2fe90168eeefc15d7d9f"),
                                        //       '2': new ObjectId("634d2fe90168eeefc15d7da0")
                                        //     }
                                        //   }
        console.log(users);// ->[
                            //     {
                            //       name: 'Bob',
                            //       age: 34,
                            //       _id: new ObjectId("634d2fe90168eeefc15d7d9e")
                            //     },
                            //     {
                            //       name: 'Alice',
                            //       age: 21,
                            //       _id: new ObjectId("634d2fe90168eeefc15d7d9f")
                            //     },
                            //     {
                            //       name: 'Tom',
                            //       age: 45,
                            //       _id: new ObjectId("634d2fe90168eeefc15d7da0")
                            //     }
                            //   ]

        //Запрос количества документов в коллекции
        const count = await collection.countDocuments();
        console.log(`В коллекции users ${count} документов`);
    }
    catch (err) {
        console.log("Возникла ошибка");
        console.log(err);
    }
    finally {
        //Закрыте подключение при завершении работы или при ошибке
        await mongoClient.close();
        console.log("Подключение закрыто");
    }
}

run();