const mongoose = require("mongoose");
mongoose.connect('mongodb://root:secretpassword123@127.0.0.1:27017/myprojectDB?authSource=admin');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});
const Project = mongoose.model('Project', ProjectSchema);

const sampleProject = new Project({
    title: "Kitten 4",
    image: "images/kitten-4.jpg",
    link: "About Kitten 4",
    description: "Demo description about kitten 4"
});
sampleProject.save().then(() => console.log("Sample project saved!"));