const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const db = require('../utils/database');

async function doesCityExist(name) {
    const q = `SELECT COUNT(*) Cnt FROM City WHERE (CityName = ${db.escape(name)});`;
    const result = await db.query(q);
    return result.Cnt > 0;
}

async function getCityId(name) {
    const q = `SELECT CityID FROM City WHERE (CityName = ${db.escape(name)});`;
    const result = await db.query(q);
    return result.CityID;
}

async function doesUserExist(id) {
    const q = `SELECT COUNT(*) Cnt FROM \`User\` WHERE (UserID = ${db.escape(id)});`;
    const result = await db.query(q);
    return result.Cnt > 0;
}

async function selectUser(id) {
    const q = `SELECT UserID, Name, Photo, About, Email, PhoneNumber, Facebook, Instagram, Telegram, CityName, Address
        FROM \`User\` LEFT JOIN City
        ON (\`User\`.CityID = City.CityID)
        WHERE (UserID = ${db.escape(id)});`;
    let result = await db.query(q);
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

// test nulles
router.put('/:id', auth, async (req, res) => {
    try {
        const id = (req.params.id == 'me') ? req.user._id : parseInt(req.params.id);
        if (id != req.user._id) return res.status(403).send(`Forbidden. Cannot update unauthorised user.`);
        const userExists = await doesUserExist(id);
        if (!userExists) return res.status(404).send(`User with the given id was not found.`);
        const cityExists = await doesCityExist(req.body.city);
        if (req.body.city != null && !cityExists) return res.status(400).send(`City ${req.body.city} does not exist.`);
        await updateUser(id, req.body);
        const user = req.body;
        user.id = id;
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = (req.params.id == 'me') ? req.user._id : parseInt(req.params.id);
        if (id != req.user._id) return res.status(403).send(`Forbidden. Cannot delete unauthorised user.`);
        const exists = await doesUserExist(id);
        if (!exists) return res.status(404).send(`User with the given id was not found.`);
        await deleteUser(id, req.body);
        const user = req.body;
        user.id = id;
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;