//Ключевой класс для работы с MongoDB
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//подключение к серверу бд
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

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

        //-- await insertMany(collection);

        await countDocuments(collection);

        //--await find(collection);

        //--await findWithName(collection);

        //-- await findWithNameAge(collection);

        //-- await findOneWithName(collection);

        //-- await deleteDocument(collection, 'drop');

        //-- await findOneAndUpdate(collection, { name: "Tom" }, { $set: { age: 21 } }, { returnDocument: "after" });

        //-- await updateMany(collection, { name: "Bob" }, { $set: { name: "Tom" } });

        //-- await updateOne(collection, {name: "Tom"}, {$set: {name: "Bob"}});
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
    let users = [{ name: "Bob", age: 34 }, { name: "Bob", age: 21 }, { name: "Bob", age: 45 }];
    resultInsertMany = await collection.insertMany(users);
    console.log("Добавление нескольких документов успешно");
    console.log(resultInsertMany); // ->{
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
        case 'drop': {
            //удаление всей коллекции
            //Если удаляемая коллекция - единственная в бд, то бд тоже удалится
            const resultDelete = await collection.drop();
            console.log(resultDelete);
            break;
        }
    }
    return;
}

async function findOneAndUpdate(collection, filter, update, returnDocument) {
    /*изменение документа, 
        filter - параметр для поиска документа, 
    update - данные для изменения, 
    returnDocument - возврат документа, до изменения или после*/
    const resultBefore = await collection.findOneAndUpdate(filter, update);
    console.log(resultBefore);//->{
    // {
    //     lastErrorObject: { n: 1, updatedExisting: true },
    //     value: {
    //       _id: new ObjectId("634fd6d90c8f1f843e58ca5f"),
    //       name: 'Tom',
    //       age: 21
    //     },
    //     ok: 1
    //   }
    const resultAfter = await collection.findOneAndUpdate(filter, update, returnDocument);
    console.log(resultAfter);//->{
    //     lastErrorObject: { n: 1, updatedExisting: true },
    //     value: {
    //       _id: new ObjectId("634fd6d90c8f1f843e58ca5f"),
    //       name: 'Tom',
    //       age: 30
    //     },
    //     ok: 1
    //   }
    return;
}

async function updateMany(collection, filter, update) {
    //изменение нескольких документов
    const result = await collection.updateMany(filter, update);
    console.log(result);//->
    // {
    //     acknowledged: true,
    //     modifiedCount: 3,
    //     upsertedId: null,
    //     upsertedCount: 0,
    //     matchedCount: 3
    //   }
    return;
}

async function updateOne(collection, filter, update) {
    //изменение документа без возвращения его
    const result = await collection.updateOne(filter, update);
    console.log(result);//->
    // {
    //     acknowledged: true,
    //     modifiedCount: 1,
    //     upsertedId: null,
    //     upsertedCount: 0,
    //     matchedCount: 1
    //   }
    return;
}

//mongoose
//Установка схемы
const userScheme = new Schema({
    name: {
        type: String,
        default: "NoName", //значение по умолчанию
        //валидация
        required: true,
        maxlength: 20
    },
    age: {
        type: Number,
        default: 1,
        required: true,
        min: 1,
        max: 150
    }
},
    //отключение поля версии документа
    { versionKey: false }
);

// подключение к базе данных
mongoose.connect("mongodb://localhost:27017/usersdb", { useUnifiedTopology: true, useNewUrlParser: true });

//Создание модели, "User" - название модели, в бд эта коллекция хранится во множественном числе
const User = mongoose.model("User", userScheme);
const user = new User({
    //метаданные объектов
    name: "Bill",
    age: 41
});

const user1 = new User({ name: "Lui" });// если age = 0 -> Error: User validation failed: age: Path `age` (0) is less than minimum allowed value (1).

//сохранение текущего объекта в базу данных
// user1.save((err) => {
//     mongoose.disconnect();

//     if (err) return console.log(err);
//     console.log("Объект сохранен", user1);//-> 
//     // Объект сохранен {
//     //     name: 'Bill',
//     //     age: 41,
//     //     _id: new ObjectId("635280d6d6fb3ceeef2a48d7"),
//     //     __v: 0
//     //   }
// })
const filter = {name: "Q"};

User.findOne(filter, (err, docs)=>{
    mongoose.disconnect();

    if (err) return console.log(err);
    console.log(docs);//->
    // [
    //     {
    //       _id: new ObjectId("635280d6d6fb3ceeef2a48d7"),
    //       name: 'Bill',
    //       age: 41,
    //       __v: 0
    //     },
    //     {
    //       _id: new ObjectId("63528263bb590eb30ea5cd17"),
    //       name: 'Bill',
    //       age: 41,
    //       __v: 0
    //     },
    //     {
    //       _id: new ObjectId("635282b31c037cfb5e560d7f"),
    //       name: 'Lui',
    //       age: 1,
    //       __v: 0
    //     }
    //   ]
})
/*аналогиченые методы
findOne() - возвращает один объект
findById() - возвращает документ с определенным идентификатором
deleteOne() - удаление одного объекта 
deleteMany() - удаление всех объектов
findOneAndDelete() - поиск одного объекта и удаление его
finByIdAndDelete() - поиск одного объекта по полю _id и удаление его
updateOne() - изменение первого документа 
updateMany() - изменение всех документов
findByIdAndUpdate(id, filter, {new: true}) - поиск одного объекта по _id и изменнеие его
*/

//сохранение через promise
// user.save()
// //получение данных, которые возвратил сервер базы данных
// .then((doc)=>{
//     console.log("Сохранен объект", doc);
//     mongoose.disconnect();
// })
// .catch((err)=>{
//     console.log(err);
//     mongoose.disconnect();
// })

// run();

console.log("Локальный модуль mongo подключен")