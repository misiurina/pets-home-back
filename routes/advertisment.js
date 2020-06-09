const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const db = require('../utils/database');

async function doesUserExist(id) {
    const q = `SELECT COUNT(*) Cnt FROM \`User\` WHERE (UserID = ${db.escape(id)});`;
    const result = await db.query(q);
    const cnt = (result.length == undefined) ? result.Cnt : result[0].Cnt;
    return cnt > 0;
}

async function selectUser(id) {
    const q = `SELECT UserID, Name, Photo, About, Email, PhoneNumber, Facebook, Instagram, Telegram, CityName, Address
        FROM \`User\` LEFT JOIN City
        ON (\`User\`.CityID = City.CityID)
        WHERE (UserID = ${db.escape(id)});`;
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
        "city": result.CityName,
        "address": result.Address
    };
}

async function getCityId(name) {
    const q = `SELECT CityID FROM City WHERE (CityName = ${db.escape(name)});`;
    console.log(db.escape(name));
    const result = await db.query(q);
    console.log(result);
    return (result.length == undefined) ? result.CityID : result[0].CityID;
}

async function updateUser(id, user) {
    const q = `UPDATE \`User\`
        SET Name = ${db.escape(user.name)}, Photo = ${db.escape(user.photo)}, About = ${db.escape(user.about)},
        Email = ${db.escape(user.email)}, PhoneNumber = ${db.escape(user.phone_number)},
        Facebook = ${db.escape(user.facebook)}, Instagram = ${db.escape(user.instagram)}, Telegram = ${db.escape(user.telegram)},
        CityID = ${db.escape(await getCityId(user.city))}, Address = ${db.escape(user.address)}
        WHERE (\`User\`.UserID = ${db.escape(id)})`;
    return await db.query(q);
}

async function deleteUser(id) {
    const q = `DELETE FROM \`User\` WHERE (UserID = ${db.escape(id)});`;
    return await db.query(q);
}

router.get('/:id', auth, async (req, res) => {
    try {
        const id = (req.params.id == 'me') ? req.user._id : parseInt(req.params.id);
        const exists = await doesUserExist(id);
        if (!exists) return res.status(404).send(`User with the given id was not found.`);
        const user = await selectUser(id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;