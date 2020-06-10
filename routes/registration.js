const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const db = require('../utils/database');

async function isEmailTaken(email) {
    const q = `SELECT COUNT(*) \`Count\` FROM \`User\` WHERE (Email = ${db.escape(email)});`;
    const result = await db.query(q);
    return result.Count;
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
            user = {
                "id": result.id,
                "name": req.body.name,
                "email": req.body.email
            }

            const authToken = jwt.sign({ _id: result.id }, config.get('jwtPrivateKey'));
            return res.header('x-auth-token', authToken).cookie('AuthToken', authToken).json(user);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;