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

async function getPublisherId(id) {
    const q = `SELECT PublisherID FROM Advertisement WHERE (AdvertisementID = ${db.escape(id)});`;
    const result = await db.query(q);
    return result.PublisherID;
}

async function doesAdvertisementExist(id) {
    const q = `SELECT COUNT(*) Cnt FROM Advertisement WHERE (AdvertisementID = ${db.escape(id)});`;
    const result = await db.query(q);
    return result.Cnt > 0;
}

async function insertAdvertisement(ad) {
    const q = `INSERT INTO Advertisement (Title, AnimalType, Sex, Size, Age, Color, Breed, CostOfLiving,
        Description, Vaccines, Allergies, Parasites, HealthStatus, IllnessDescription, BehavioralDisorders,
        BehavioralDisordersDescription, CityID, PublisherID, ModifiedDate, DueDate, ActiveStatus)
        VALUES (${db.escape(ad.title)}, ${db.escape(ad.animal_type)}, ${db.escape(ad.sex)},
        ${db.escape(ad.size)}, ${db.escape(ad.age)}, ${db.escape(ad.color)},
        ${db.escape(ad.breed)}, ${db.escape(ad.cost_of_living)}, ${db.escape(ad.description)},
        ${db.escape(ad.vaccines)}, ${db.escape(ad.allergies)}, ${db.escape(ad.parasites)},
        ${db.escape(ad.health_status)}, ${db.escape(ad.illness_description)}, ${db.escape(ad.behavioral_disorders)},
        ${db.escape(ad.behavioral_disorders_description)}, ${db.escape(await getCityId(ad.city))}, ${db.escape(ad.publisher_id)},
        ${db.escape(ad.modified_date)}, ${db.escape(ad.due_date)}, ${db.escape(ad.is_active)});`;
    return await db.query(q);
}

async function insertAdvertisementPhotos(id, photos) {
    if (photos == null) return;
    for (let i = 0; i < photos.length; i++) {
        const q = `INSERT INTO AdvertisementPhoto (AdvertisementID, Photo) VALUES (${db.escape(id)}, ${db.escape(photos[i])})`;
        await db.query(q);
    }
}

async function selectAdvertisement(id) {
    const q1 = `SELECT AdvertisementID, Title, AnimalType, Sex, Size, Age, Color, Breed, CostOfLiving,
        Description, Vaccines, Allergies, Parasites, HealthStatus, IllnessDescription, BehavioralDisorders,
        BehavioralDisordersDescription, CityName, PublisherID, ModifiedDate, DueDate, ActiveStatus
        FROM Advertisement LEFT JOIN City
        ON (Advertisement.CityID = City.CityID)
        WHERE (AdvertisementID = ${db.escape(id)});`;
    const q2 = `SELECT Photo FROM AdvertisementPhoto WHERE (AdvertisementID = ${db.escape(id)});`;
    const ad = await db.query(q1);
    const p = await db.query(q2);
    const photos = []
    if (p.length == undefined) {
        photos.push(p.Photo);
    } else {
        for (let i = 0; i < p.length; i++) {
            photos.push(p[i].Photo);
        }
    }
    return {
        "id": ad.AdvertisementID,
        "title": ad.Title,
        "animal_type": ad.AnimalType,
        "sex": ad.Sex,
        "size": ad.Size,
        "age": ad.Age,
        "color": ad.Color,
        "breed": ad.Breed,
        "cost_of_living": ad.CostOfLiving,
        "description": ad.Description,
        "vaccines": ad.Vaccines,
        "allergies": ad.Allergies,
        "parasites": ad.Parasites,
        "health_status": ad.HealthStatus,
        "illness_description": ad.IllnessDescription,
        "behavioral_disorders": (ad.BehavioralDisorders == 1),
        "behavioral_disorders_description": ad.BehavioralDisordersDescription,
        "city": ad.CityName,
        "publisher_id": ad.PublisherID,
        "modified_date": ad.ModifiedDate,
        "due_date": ad.DueDate,
        "is_active": (ad[i].ActiveStatus == 1),
        "photos": photos
    };
}

async function selectAdvertisements() {
    const ads = [];
    const q1 = `SELECT AdvertisementID, Title, AnimalType, Sex, Size, Age, Color, Breed, CostOfLiving,
        Description, Vaccines, Allergies, Parasites, HealthStatus, IllnessDescription, BehavioralDisorders,
        BehavioralDisordersDescription, CityName, PublisherID, ModifiedDate, DueDate, ActiveStatus
        FROM Advertisement LEFT JOIN City
        ON (Advertisement.CityID = City.CityID);`;
    let ad = await db.query(q1);
    if (ad.length == undefined) ad = [ad];
    for (let i = 0; i < ad.length; i++) {
        const q2 = `SELECT Photo FROM AdvertisementPhoto WHERE (AdvertisementID = ${db.escape(ad[i].AdvertisementID)});`;
        const p = await db.query(q2);
        const photos = []
        if (p.length == undefined) {
            photos.push(p.Photo);
        } else {
            for (let j = 0; j < p.length; j++) {
                photos.push(p[j].Photo);
            }
        }
        const advertisement = {
            "id": ad[i].AdvertisementID,
            "title": ad[i].Title,
            "animal_type": ad[i].AnimalType,
            "sex": ad[i].Sex,
            "size": ad[i].Size,
            "age": ad[i].Age,
            "color": ad[i].Color,
            "breed": ad[i].Breed,
            "cost_of_living": ad[i].CostOfLiving,
            "description": ad[i].Description,
            "vaccines": ad[i].Vaccines,
            "allergies": ad[i].Allergies,
            "parasites": ad[i].Parasites,
            "health_status": ad[i].HealthStatus,
            "illness_description": ad[i].IllnessDescription,
            "behavioral_disorders": (ad.BehavioralDisorders == 1),
            "behavioral_disorders_description": ad[i].BehavioralDisordersDescription,
            "city": ad[i].CityName,
            "publisher_id": ad[i].PublisherID,
            "modified_date": ad[i].ModifiedDate,
            "due_date": ad[i].DueDate,
            "is_active": (ad[i].ActiveStatus == 1),
            "photos": photos
        }
        ads.push(advertisement);
    }
    return ads;
}

async function updateAdvertisement(id, ad) {
    const q = `UPDATE Advertisement SET
        Title = ${db.escape(ad.title)}, AnimalType = ${db.escape(ad.animal_type)}, Sex = ${db.escape(ad.sex)},
        Size = ${db.escape(ad.size)}, Age = ${db.escape(ad.age)}, Color = ${db.escape(ad.color)},
        Breed = ${db.escape(ad.breed)}, CostOfLiving = ${db.escape(ad.cost_of_living)}, Description = ${db.escape(ad.description)},
        Vaccines = ${db.escape(ad.vaccines)}, Allergies = ${db.escape(ad.allergies)}, Parasites = ${db.escape(ad.parasites)},
        HealthStatus = ${db.escape(ad.health_status)}, IllnessDescription = ${db.escape(ad.illness_description)},
        BehavioralDisorders = ${db.escape(ad.behavioral_disorders)}, BehavioralDisordersDescription = ${db.escape(ad.behavioral_disorders_description)},
        CityID = ${db.escape(await getCityId(ad.city))}, ModifiedDate = ${db.escape(ad.modified_date)}, DueDate = ${db.escape(ad.due_date)}
        WHERE (AdvertisementID = ${db.escape(id)});`;
    return await db.query(q);
}

async function updateAdvertisementPhotos(id, photos) {
    const q = `DELETE FROM AdvertisementPhoto WHERE (AdvertisementPhotoID = ${db.escape(id)});`;
    const result = await db.query(q);
    result.then(await insertAdvertisementPhotos(id, photos));
}

async function setAdvertisementInactive(id) {
    const q = `UPDATE Advertisement SET ActiveStatus = ${db.escape(0)} WHERE (AdvertisementID = ${db.escape(id)});`;
    return await db.query(q);
}

router.get('/:id', async (req, res) => {
    try {
        const exists = await doesAdvertisementExist(req.params.id);
        if (!exists) return res.status(404).send(`Advertisement with the given id was not found.`);
        const advertisement = await selectAdvertisement(req.params.id);
        res.json(advertisement);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

//add queries
router.get('/', async (req, res) => {
    try {
        const advertisements = await selectAdvertisements();
        res.json(advertisements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const id = req.user._id;
        const cityExists = await doesCityExist(req.body.city);
        if (req.body.city != null && !cityExists) return res.status(400).send(`City ${req.body.city} does not exist.`);
        const ad = req.body;
        ad.publisher_id = id;
        ad.behavioral_disorders = ad.behavioral_disorders ? 1 : 0;
        ad.modified_date = Math.round((new Date()).getTime() / 1000);
        ad.due_date = ad.modified_date + 2629743;
        ad.is_active = 1;
        const result = await insertAdvertisement(ad);
        await insertAdvertisementPhotos(result.insertId, ad.photos);
        ad.behavioral_disorders = (ad.behavioral_disorders == 1);
        ad.is_active = (ad.is_active == 1);
        res.json(ad);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const exists = await doesAdvertisementExist(req.params.id);
        if (!exists) return res.status(404).send(`Advertisement with the given id was not found.`);
        const id = req.user._id;
        const publisherId = await getPublisherId(req.params.id);
        if (id != publisherId) return res.status(403).send(`Forbidden. Cannot update unauthorised user's advertisement.`);
        const cityExists = await doesCityExist(req.body.city);
        if (req.body.city != null && !cityExists) return res.status(400).send(`City ${req.body.city} does not exist.`);
        const ad = req.body;
        ad.publisher_id = publisherId;
        ad.behavioral_disorders = ad.behavioral_disorders ? 1 : 0;
        ad.modified_date = Math.round((new Date()).getTime() / 1000);
        ad.due_date = ad.modified_date + 2629743;
        ad.is_active = 1;
        await updateAdvertisement(req.params.id, ad);
        await updateAdvertisementPhotos(req.params.id, ad.photos);
        ad.behavioral_disorders = (ad.behavioral_disorders == 1);
        ad.is_active = (ad.is_active == 1);
        res.json(ad);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const exists = await doesAdvertisementExist(req.params.id);
        if (!exists) return res.status(404).send(`Advertisement with the given id was not found.`);
        const id = req.user._id;
        const publisherId = await getPublisherId(req.params.id);
        if (id != publisherId) return res.status(403).send(`Forbidden. Cannot delete unauthorised user's advertisement.`);
        await setAdvertisementInactive(id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;