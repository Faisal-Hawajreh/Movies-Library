const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const movieData = require('./Movie Data/data.json');
const res = require('express/lib/response');


app.get('/',MoviesHandler);
app.get('/favorite',welcomeHandler);
app.get('/error',InternalServerErrHandler)
app.get('*',notFoundHandlar);

function notFoundHandlar(req,res){
    return res.status(404).send("Not Found!!!")
}

function InternalServerErrHandler(req,res){
    let message = {
        "status" :500,
        "responseText": "Sorry, something went wrong"
    }
    return res.status(500).send(message)
}

function welcomeHandler(req,res){
    return res.status(200).send("Welcome to Favorite page")
}


function Movies(original_title,poster_path,overview){
    this.title = original_title;
    this.poster_path = poster_path;
    this.overview =  overview;
}

function MoviesHandler(req,res){
    let movie = [];
    movieData.data.map(movies =>{
        let newMovie = new Movies(movies.original_title,movies.poster_path,movies.overview)
        movie.push(newMovie)
    })
    return res.status(200).json(movie)
}


app.listen(3000,()=>{
    console.log('listening to port 3000')
})









