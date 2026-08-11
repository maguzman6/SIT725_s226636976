const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.MONGO_USER || 'root'}:${process.env.MONGO_PASSWORD || 'secretpassword123'}@127.0.0.1:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DATABASE || 'bookDB'}?authSource=admin`);

const booksData = [
    {
        "id": "b1",
        "title": "The Three-Body Problem",
        "author": "Liu Cixin",
        "year": 2008,
        "genre": "Science Fiction",
        "summary": "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy. The series portrays a fictional past, present, and future wherein Earth encounters an alien civilization from a nearby system of three Sun-like stars orbiting one another, a representative example of the three-body problem in orbital mechanics.",
        "price": 29.99
    },
    {
        "id": "b2",
        "title": "Jane Eyre",
        "author": "Charlotte Brontë",
        "year": 1847,
        "genre": "Classic",
        "summary": "An orphaned governess confronts class, morality, and love at Thornfield Hall, uncovering Mr. Rochester’s secret and forging her own independence.",
        "price": 22.00
    },
    {
        "id": "b3",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "year": 1813,
        "genre": "Classic",
        "summary": "Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations in a sharp study of manners and marriage.",
        "price": 22.00
    },
    {
        "id": "b4",
        "title": "The English Patient",
        "author": "Michael Ondaatje",
        "year": 1992,
        "genre": "Historical Fiction",
        "summary": "In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts confront memory, identity, and loss.",
        "price": 25.39
    },
    {
        "id": "b5",
        "title": "Small Gods",
        "author": "Terry Pratchett",
        "year": 1992,
        "genre": "Fantasy",
        "summary": "In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma, empire, and the nature of belief",
        "price": 31.99
    }];

const bookItems = require('../models/book');

(async () => {
    try {
        // ensure unique on id (good practice)
        await bookItems.collection.createIndex({ id: 1 }, { unique: true });

        // clear and insert
        await bookItems.deleteMany({});
        await bookItems.insertMany(booksData);
        console.log('Seeded 5 book items.');
    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
})();