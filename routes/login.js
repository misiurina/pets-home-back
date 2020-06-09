const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const db = require('../utils/database');

async function validateCredentials(email, password) {
    const q1 = `SELECT COUNT(*) \`Count\`, Salt FROM \`User\` WHERE (Email = ${db.escape(email)});`;
    const result1 = await db.query(q1);
    let count;
    let salt;
    count = (result1.length == undefined) ? result1.Count : result1[0].Count;
    salt = (result1.length == undefined) ? result1.Salt : result1[0].Salt;
    if (count == 0) return false;
    
    const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
    const q2 = `SELECT COUNT(*) \`Count\` FROM \`User\` WHERE (Email = ${db.escape(email)}) AND (Password = ${db.escape(hash)});`;
    const result2 = await db.query(q2);
    count = (result2.length == undefined) ? result2.Count : result2[0].Count;
    return count > 0;
}

async function selectUser(email) {
    const q = `SELECT UserID, Name, Photo, About, Email, PhoneNumber, Facebook, Instagram, Telegram, CityName, Address
        FROM \`User\` LEFT JOIN City
        ON (\`User\`.CityID = City.CityID)
        WHERE (Email = ${db.escape(email)});`;
    let result = await db.query(q);
    if (result.length != undefined) result = result[0];
    return {
        "id": result.UserID,
        "name": result.Name,
        "photo": result.Photo,
        "about": result.About,
        "email": result.Email,
        "phone_number": result.PhoneNumber,
        "facebook": result.Facebook,
        "instagram": result.Instagram,
        "telegram": result.Telegram,
        "city": result.City,
        "address": result.Address
    };
}

router.post('/', async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase();
        const access = await validateCredentials(req.body.email, req.body.password);
        if (!access) {
            return res.status(400).send(`Wrong username or password.`);
        }
        const user = await selectUser(req.body.email);
        console.log(res.cookies);
        const authToken = jwt.sign({ _id: user.id }, config.get('jwtPrivateKey'));
        res.cookie('AuthToken', authToken).json(user);
        console.log(req.cookies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;