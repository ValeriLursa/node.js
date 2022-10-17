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
        console.log("Подключение к серверу успешно");

        //Взаимодействие с базой данных
        //обращение к базе данных admin
        //Если базы данных с таким именем нет, то сервер создаст ее автоматически
        const db = mongoClient.db("admin");
        console.log("Подключение к базе данных успешно");

        //--await command(db);

        //Если коллекции в базе данных нет, то сервер создаст ее автоматически
        const collection = db.collection("users");

        //-- await insertOne(collection);

        //--await insertMany(collection);

        await countDocuments(collection);

        //--await find(collection);

        //--await findWithName(collection);

        //-- await findWithNameAge(collection);

        //-- await findOneWithName(collection);
        
        await deleteDocument(collection, 'drop');
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

async function insertOne(collection) {
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
    return;
}

async function insertMany(collection) {
    //Добавление нескольких документов
    let users = [{ name: "Bob", age: 34 }, { name: "Alice", age: 21 }, { name: "Tom", age: 45 }];
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
    return;
}

async function countDocuments(collection) {
    //Запрос количества документов в коллекции
    const count = await collection.countDocuments();
    console.log(`В коллекции users ${count} документов`);
    return;
}

async function command(db) {
    //Проведение диагностики базы данных
    //ping: 1 - проверка подключения к базе данных
    const resultCommand = await db.command({ ping: 1 });
    console.log("Подключение с базой данных успешно установлено");
    console.log(resultCommand); // -> { ok: 1 }
    return;
}

async function find(collection) {
    //Получение данных из коллекции.
    //Фнукция find возвращает специальный объекта FindCursor
    const resultFind = await collection.find().toArray();
    console.log(resultFind); // -> Array()
    return;
}

async function findWithName(collection, filter = { name: "Tom" }) {
    //Получение данных из коллекции с фильтром
    const resultFind = await collection.find(filter).toArray();
    console.log(resultFind); // -> Array()
    console.log(`Количество документов с name: ${filter.name}: ${resultFind.length}`); // -> Number()
    return;
}

async function findWithNameAge(collection, filter = { name: "Tom", age: 23 }) {
    //Получение данных из коллекици с фильтром
    const resultFind = await collection.find(filter).toArray();
    console.log(resultFind); // -> Array()
    console.log(`Количество документов с name: "Tom" ${resultFind.length}`); // -> Number()
    return;
}

async function findOneWithName(collection, filter = { name: "Tom" }) {
    const resultFind = await collection.findOne(filter);
    console.log(resultFind); // -> { _id: new ObjectId("634d2e175198c8ab938681ba"), name: 'Tom', age: 23 }
    console.log(resultFind.name); // -> "Tom"
}

async function deleteDocument(collection, nameFunction, filter) {
    switch (nameFunction) {
        case 'deleteOne': {
            //удаление первого документа по фильтру
            const resultDelete = await collection.deleteOne(filter);
            console.log(resultDelete);// -> { acknowledged: true, deletedCount: 1 }
            break;
        }
        case 'deleteMany': {
            //удаление всех документов по фильтру
            const resultDelete = await collection.deleteMany(filter);
            console.log(resultDelete);// -> { acknowledged: true, deletedCount: 3 }
            break;
        }
        case 'findOneAndDelete': {
            //удаление первого объекта по фильтру и возвращение его данных
            const resultDelete = await collection.findOneAndDelete(filter);
            console.log(resultDelete);// ->{
            //     lastErrorObject: { n: 1 },
            //     value: {
            //       _id: new ObjectId("634d2e175198c8ab938681ba"),
            //       name: 'Tom',
            //       age: 23
            //     },
            //     ok: 1
            //   }
            break;
        }
        case 'drop':{
            //удаление всей коллекции
            //Если удаляемая коллекция - единственная в бд, то бд тоже удалится
            const resultDelete = await collection.drop();
            console.log(resultDelete);
            break;
        }
    }
    return;
}

run();