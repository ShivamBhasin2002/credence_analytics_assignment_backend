const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Schema = mongoose.Schema;
const app = express();
require("dotenv").config();

mongoose.connect(process.env.DATABASENAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const movieSchema = new Schema({
    name: String,
    img: String,
    summary: String
});

const Movie = mongoose.model('movie',movieSchema);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Seed data into database route
app.get('/seed',(req,res)=>{
    let seedData = [
        {
            name: "Harry Potter and the Order of the Phoenix",
            img: "https://bit.ly/2IcnSwz",
            summary: "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry."
        },
        {
            name: "The Lord of the Rings: The Fellowship of the Ring",
            img: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FM%2FMV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY%40._V1_.jpg&imgrefurl=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt0120737%2F&tbnid=6-f04EV6lrjNxM&vet=12ahUKEwiGtO3J94DzAhWMASsKHVS-AcAQMygAegUIARDIAQ..i&docid=EG_nUnHoVl_RiM&w=1978&h=2936&q=lord%20of%20the%20rings&ved=2ahUKEwiGtO3J94DzAhWMASsKHVS-AcAQMygAegUIARDIAQ",
            summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
        },
        {
            name: "Avengers: Endgame",
            img: "https://bit.ly/2Pzczlb",
            summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe."
        }
    ];
    Movie.insertMany(seedData);
    res.send('Data has been seeded');
});

//Show all
app.get('/movies/',async (req,res)=>{
    const movies = await Movie.find({});
    res.send(movies);
});

//Show Movie
app.get('/movies/:id',async (req,res)=>{
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
});

//Creat Movie
app.post('/movies/',(req,res)=>{
    const movie = new Movie(req.body.movie);
    movie.save();
    res.redirect(`/movies/${movie._id}`);
});

//Edit Movie
app.put('/movies/:id', async (req,res)=>{
    await Movie.findByIdAndUpdate(req.params.id,req.body.movie);
    res.redirect('/movies/'+req.params.id);
});

//Delete Movie
app.delete('/movies/:id',async (req,res)=>{
    await Movie.findByIdAndDelete(req.params.id);
    res.send('Movie Deleted');
});

app.get('*', (req,res)=>{
    res.send('INVALID ROUTE TRY AGAIN');
});

app.listen(process.env.port, ()=>{
    console.log("SERVER STARTED");
})