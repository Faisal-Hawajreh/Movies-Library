'use strict'


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const server = express();


server.use(cors());

const movieData = require('./Movie Data/data.json');
// const res = require('express/lib/response');
const PORT = process.env.PORT;

server.get('/',MoviesHandler);
server.get('/favorite',welcomeHandler);
server.get('/trending',trendingMovieHandler)
server.get('/search',searchMovieHandler)
server.get('/languages',languagesHandler)
server.get('/jobs',jobsHandler)
server.get('*',notFoundHandler);
server.use(InternalServerErrHandler);

let urlTrending = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
let urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2`
let urlLanguages = `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.APIKEY}`
let urlJobs = `https://api.themoviedb.org/3/configuration/jobs?api_key=${process.env.APIKEY}`


// departments = Crew,Art,Writing,Visual Effects,Production,Camera,Directing,Editing,Sound,Lighting,Costume & Make-Up,Actors
let departmentName = "Actors"
function jobsHandler(req,res){
    axios.get(urlJobs)
        .then((result)=>{
            // console.log(result.data)
            // res.status(200).json(result.data)
            let jobsList = result.data
                for(let i = 0;i<jobsList.length;i++){
                    let exactDepartment = jobsList[i]
                    if(exactDepartment.department == departmentName){
                    return res.status(200).json(exactDepartment);
                    }
                }
            }
        )
        .catch((err)=>{
            InternalServerErrHandler(req,res);
    })

}



function NewMovies(id,title,release_date,poster_path,overview){
    this.id = id;
    this.title = title;
    this.release_date =  release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function trendingMovieHandler(req,res){
    // let newArr = [];
    axios.get(urlTrending)
        .then((result)=>{
            // console.log(result.data.results)
            let movies = result.data.results.map(movie =>{
            return new NewMovies(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
        });
        for(let i = 0;i<movies.length;i++){
            let exactMovie = movies[i]
            if(exactMovie.id == 634649){
                res.status(200).json(exactMovie)
            }
        }
        // res.status(200).json(movies);
        // result.data.results.forEach(movie =>{
        //     newArr.push(new Movies(movie.original_title,movie.poster_path,movie.overview);
        // })
        // res.status(200).json(newArr);

    }).catch((err)=>{
        InternalServerErrHandler(req,res);
    })
}

function languagesHandler(req,res){
    axios.get(urlLanguages)
        .then((result)=>{
            // console.log(result.data)
            return res.status(200).json(result.data);
    })

    .catch((err)=>{
        InternalServerErrHandler(req,res);
    })
}










let movieName = "Boruto: Naruto the Movie"
function searchMovieHandler(req,res){
    // let newArr = [];
    axios.get(urlSearch)
        .then((result)=>{
            // console.log(result.data.results)
            let movieList = result.data.results;
                for(let i = 0;i<movieList.length;i++){
                    let exactMovie = movieList[i]
                    if(exactMovie.title == movieName){
                    return res.status(200).json(exactMovie);
                    }
                }
            }
        )
        .catch((err)=>{
            InternalServerErrHandler(req,res);
    })

}


function notFoundHandler(req,res){
    return res.status(404).send("Not Found!!!")
}

function InternalServerErrHandler(req,res){

    const err = {
        "status" :500,
        "responseText": "Sorry, something went wrong"
    }
    return res.status(500).send(err)
}

function welcomeHandler(req,res){
    return res.status(200).send("Welcome to Favorite page")
}


function Movies(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview =  overview;
}

function MoviesHandler(req,res){
    // let movie = [];
        let newMovie = new Movies(movieData.original_title,movieData.poster_path,movieData.overview)
    return res.status(200).json(newMovie)
}



server.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`)
})









