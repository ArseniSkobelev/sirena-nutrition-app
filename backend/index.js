const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

// Import 'User' model
const User = require('./models/User')

const _PORT = 3005;
const _DATABASE_URI = "mongodb://localhost/sirena";
const _USERS_COLLECTION = "users";
const _PRODUCTS = "products";
const _WEIGHT_CHANGES = "weight_changes";
const _FOODS_EATEN = "foods_eaten";
const _SECRET = "V?HkqCtg-!!__OEDWv8>FRpzr-$u&H=oc,K~!?vnXp=L;TD?`4Kg@~=98}b3K)6";

// 24h in milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: _SECRET,
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

mongoose.connect(_DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true});

let connection = mongoose.connection;

connection.on('error', console.error.bind(console, "< ! > MongoDB connection error < ! >"))

app.get('/', (req, res) => {
    res.send({message: "Welcome to Sirena API v0.0"});

    const user = new User({
        _id: mongoose.Types.ObjectId(),
        full_name: "Arseni Skobelev",
        email: "arseni.skobelev@gmail.com",
        password: "1234"
    });

    user.save(function (err) {
        if(err) return console.log(err);
        console.log("saved!");
    })
});



app.post('/createUser', (req, res) => {

});

app.listen(_PORT, () => console.log(`Sirena API is started on port ${_PORT}!`));