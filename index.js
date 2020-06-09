const md5 = require('md5');
const Joi = require('joi');
//const usragent = require('express-useragent');
const express = require('express');
const app = express();
app.use(express.json());
//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
const cors = require("cors");
//app.use(express.json({
//    type: ['application/json', 'text/plain']
//}))
//app.use(function (req, res, next) {
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//    next();
//});
/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});*/
app.use(cors());

const users = [
    { id: 1, name: "Test", email: "test@test.com", password: md5("Haslo1") }
];

const sessions = [
    //{ sessionId:, userId:, ip:, web: }
]

// developement
app.get('/api/users/', (req, res) => {
    res.send(users);
});

// developement
app.get('/api/sessions/', (req, res) => {
    res.send(sessions);
});

// developement
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        res.status(404).send(`No user with id ${req.params.id}.`);
        return;
    }
    res.send(user);
});

app.post('/api/users/', (req, res) => {
    console.log('hello');
    console.log(req.body);
    res.send(req.body);

    /*
    console.log(req);
    req.body = JSON.parse(req.body);
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const schema = {
        name: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
    }

    const validation = Joi.validate(req.body, schema);
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        //console.log(`name: ${req.body.name},\nemail: ${req.body.email},\npassword: ${req.body.password}`);
        return;
    }

    if (users.find(u => u.email === req.params.email)) {
        res.status(400).send("Użytkownik o podanym adresie email już istnieje!");
        return;
    }

    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    users.push(user);
    res.send(course);
    */
});

app.post('/api/sessions/', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    const schema = {
        userId: Joi.integer(),
        password: Joi.string()
    }

    const validation = Joi.validate(req.body, schema);
    if (validation.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const user = users.find(u => u.id === parseInt(req.params.id));
    if (users.find(u => u.id === parseInt(req.params.id) && u.password === req.params.password)) {
        const session = {
            sessionId: sessions.length + 1,
            userId: req.body.userId,
            ip: req.ip,
            web: req.headers['user-agent']
        }
        users.push(user);
        res.send(course);
    } else {
        res.status(400).send("Użytkownik o podanym adresie email lub haśle nie istnieje!");
        return;
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));