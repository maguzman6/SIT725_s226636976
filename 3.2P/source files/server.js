var express = require("express")
var app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log("App listening to: " + port)
})  

const cardList = [
    {
        coffee_name: "Coffee 2",
        image: "https://coffee.alexflipnote.dev/-gVM5xsGzGw_coffee.png",
        link: "About Coffee 2",
        coffee_description: "Hi! this is coffee 2"
    },
    {
        coffee_name: "Coffee 3",
        image: "https://coffee.alexflipnote.dev/VQfzJ0Vvxco_coffee.png",
        link: "About Coffee 3",
        coffee_description: "Hi! this is coffee 3"
    }
]

app.get("/get-coffee", (req, res) => {
    res.json(cardList)
})

app.post("/submit-form", (req, res) => {
    console.log("Coffee received: ", req.body);

    // obtain random coffee image from API
    fetch("https://coffee.alexflipnote.dev/random.json")
    .then(response => response.json())
    .then(data => {
        const coffeeJson = {
            coffee_name: req.body.coffee_name,
            image: data.file,
            link: "About " + req.body.coffee_name,
            coffee_description: req.body.coffee_description
        }
        cardList.push(coffeeJson);
        res.json({"message": "Form submitted successfully", "coffee": coffeeJson});
    })
    .catch(error => {
        console.error("Error fetching coffee image:", error);
        res.status(500).json({ error: "Failed to fetch coffee image" });
    })
})
