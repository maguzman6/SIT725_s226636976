var express = require("express")
var app = express()
const mongoose = require("mongoose");

// Load environment variables from .env file
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Coffee = require('./models/Coffee');

mongoose.connect(`mongodb://${process.env.MONGO_USER || 'root'}:${process.env.MONGO_PASSWORD || 'secretpassword123'}@127.0.0.1:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DATABASE || 'coffeeDB'}?authSource=admin`);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log("App listening to: " + port)
})

app.get("/get-coffee", async (req, res) => {
    const coffees = await Coffee.find({});
    res.json(coffees)
})

app.post("/submit-form", async (req, res) => {
    // obtain random coffee image from API
    fetch("https://coffee.alexflipnote.dev/random.json")
        .then(response => response.json())
        .then( async (data) => {
            const coffee = new Coffee({
                coffee_name: req.body.coffee_name,
                image: data.file,
                description: req.body.coffee_description
            });
            await coffee.save();
            res.json({ "message": "Form submitted successfully", "coffee": coffee });
        })
        .catch(error => {
            console.error("Error fetching coffee image:", error);
            res.status(500).json({ error: "Failed to fetch coffee image" });
        })
})
