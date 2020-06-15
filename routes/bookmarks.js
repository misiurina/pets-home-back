const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const db = require('../utils/database');

async function doesAdvertisementExist(id) {
    const q = `SELECT COUNT(*) Cnt FROM Advertisement WHERE (AdvertisementID = ${db.escape(id)});`;
    const result = await db.query(q);
    return result.Cnt > 0;
}

async function doesBookmarkExist(userId, adId) {
    const q = `SELECT COUNT(*) Cnt FROM Bookmark WHERE (UserID = ${db.escape(userId)} AND AdvertisementID = ${db.escape(adId)});`;
    const result = await db.query(q);
    return result.Cnt > 0;
}

async function insertBookmark(userId, adId) {
    const q = `INSERT INTO Bookmark (UserID, AdvertisementID) VALUES (${db.escape(userId)}, ${db.escape(adId)})`;
    await db.query(q);
}

async function selectBookmarkedAdvertisements(publisherId) {
    const ads = [];
    const q1 = `SELECT A.AdvertisementID, Title, AnimalType, Sex, Size, Age, Color, Breed, CostOfLiving,
        Description, Vaccines, Allergies, Parasites, HealthStatus, IllnessDescription, BehavioralDisorders,
        BehavioralDisordersDescription, CityName, PublisherID, ModifiedDate, DueDate, ActiveStatus
        FROM Advertisement A
        LEFT JOIN City ON A.CityID = City.CityID
        INNER JOIN Bookmark B ON B.AdvertisementID = A.AdvertisementID
        INNER JOIN User ON B.UserID = User.UserID
        WHERE User.UserID = ${db.escape(publisherId)};`;
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

async function deleteBookmark(userId, adId) {
    const q = `DELETE FROM Bookmark WHERE (UserID = ${db.escape(userId)} AND AdvertisementID = ${db.escape(adId)});`;
    return await db.query(q);
}

router.get('/', auth, async (req, res) => {
    try {
        const id = req.user._id;
        const ads = await selectBookmarkedAdvertisements(id);
        res.json(ads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const bookmark = req.body;
        const id = req.user._id;
        const aExists = await doesAdvertisementExist(bookmark.advertisement_id);
        if (!aExists) return res.status(400).send("Advertisement with the given id does not exist");
        const bExists = await doesBookmarkExist(id, bookmark.advertisement_id);
        if (bExists) return res.json({ "user_id": id, "advertisement_id": bookmark.advertisement_id });
        await insertBookmark(id, bookmark.advertisement_id);
        bookmark.user_id = id;
        res.json(bookmark);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const adId = parseInt(req.params.id);
        const exists = await doesBookmarkExist(userId, adId);
        if (!exists) return res.status(404).send(`This advertisement was not bookmarked.`);
        await deleteBookmark(userId, adId);
        res.json({ "user_id": userId, "advertisement_id": adId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Internal Server Error`);
    }
});

module.exports = router;