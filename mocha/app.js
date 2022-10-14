const express = require("express");
var app = express();

app.get("/", (_, res) => {
    res.send("Hello test");
});

app.get("/error", (_,res) => {
    res.status(404).send("NotFound");
});

app.get("/user", (_,res)=>{
    res.send({name:"Tom", age: 22});
})

app.listen(3000);

module.exports.app = app;