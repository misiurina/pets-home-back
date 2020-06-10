const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const db = require('../utils/database');

async function doesCityExist(id) {
    const q = `SELECT COUNT(*) Cnt FROM City WHERE (CityID = ${db.escape(id)});`;
    const result = await db.query(q);
    return result.Cnt > 0;
}

async function selectCity(id) {
    const q = `SELECT CityName FROM City WHERE (CityID = ${db.escape(id)});`;
    let result = await db.query(q);
    return result.CityName;
}

async function selectCities() {
    const cities = [];
    const q = `SELECT CityName FROM City;`;
    let result = await db.query(q);
    if (result.length == undefined) result = [result];
    for (let i = 0; i < result.length; i++) {
        cities.push(result[i].CityName);
    }
    return cities;
}

router.get('/:id', async (req, res) => {
    try {
        const exists = await doesCityExist(req.params.id);
        if (!exists) return res.status(404).send(`City with the given id was not found.`);
        const city = await selectCity(req.params.id);
        res.send(city);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.get('/', async (req, res) => {
    try {
        const cities = await selectCities();
        res.json(cities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;