const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const db = require('../utils/database');

async function isEmailTaken(email) {
    const q = `SELECT COUNT(*) \`Count\` FROM \`User\` WHERE (Email = ${db.escape(email)});`;
    const result = await db.query(q);
    let count;
    if (result.length == undefined) {
        count = result.Count;
    } else {
        count = result[0].Count;
    }
    return count > 0;
}

async function insertUser(user) {
    const salt = crypto.randomBytes(32).toString('hex');
    const q = `INSERT INTO \`User\` (Name, Email, Password, Salt)
        VALUES (${db.escape(user.name)}, ${db.escape(user.email)}, ${db.escape(user.password)}, ${db.escape(salt)});`;
    return await db.query(q);
}

router.post('/', async (req, res) => {
    try {
        const emailTaken = await isEmailTaken(req.body.email);
        if (emailTaken) {
            res.status(400).send(`Email ${req.body.email} is already in use.`);
        } else {
            const result = await insertUser(req.body);
            let id;

            if (result.length == undefined) {
                id = result.insertId;
            } else {
                id = result[0].insertId;
            }

            user = {
                "id": id,
                "name": req.body.name,
                "email": req.body.email
            }

            const authToken = jwt.sign({ _id: id }, config.get('jwtPrivateKey'));
            return res.cookie('AuthToken', authToken).json(user);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;