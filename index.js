const config = require('config');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const registration = require('./routes/registration');
const login = require('./routes/login');
const user = require('./routes/user');
const advertisment = require('./routes/advertisment');
const violation = require('./routes/violation');
const bookmarks = require('./routes/bookmarks');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/zpi/api/registration', registration);
app.use('/zpi/api/login', login);
app.use('/zpi/api/user', user);
//app.use('/zpi/api/advertisment', advertisment);
//app.use('/zpi/api/violation', violation);
//app.use('/zpi/api/bookmarks', bookmarks);

if (!config.get('mysqldb.password') || !config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: Environment Variables are not configured.')
    process.exit(1);
}

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));