'use strict'


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg')

// const client = new pg.Client(process.env.DATABASE_URL);
//DATABASE_URL=postgres://faisal:123456@localhost:5432/movies
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
const server = express();

server.use(cors());
server.use(express.json());// whenever you read from the body please parse it to a json format 




const movieData = require('./Movie Data/data.json');
// const res = require('express/lib/response');
const PORT = process.env.PORT;

server.get('/',MoviesHandler);
server.get('/favorite',welcomeHandler);
server.get('/trending',trendingMovieHandler)
server.get('/search',searchMovieHandler)
server.get('/languages',languagesHandler)
server.get('/jobs',jobsHandler)
server.post('/addMovie',addMovieHandler)
server.get('/getMovies',getMovieHandler)
server.put('/updateMovie/:id',updateMovieHandler)
server.delete('/deleteMovie/:id',deleteMovieHandler)
server.get('/getOneMovie/:id',getOneMovieHandler)
server.get('*',notFoundHandler);
server.use(InternalServerErrHandler);


// /UPDATE/id: create an update request to update your comments for a specific movie in the database.\put 
// /DELETE/id : create a delete request to remove a specific movie from your database.\delete
// getMovie/id: Create a get request to get a specific movie from the database\get



function updateMovieHandler(req,res){
    const movie = req.body;
    //   console.log(movie)
    let id = req.params.id;
    let sql = `UPDATE addMovie SET title = $1,comment = $2 WHERE id = $3 RETURNING *; `
// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
    let values = [movie.title,movie.comment,id];
    client.query(sql,values).then(data=>{
    //     // console.log(data.rows)
        res.status(201).json(data.rows);
        // res.status(200).json(data.rows);

    }).catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}

function deleteMovieHandler(req,res){
    let id = req.params.id;
    let sql = `DELETE FROM addMovie WHERE id = ${id};`
    // DELETE FROM table_name WHERE condition;
    client.query(sql).then(data=>{
        // console.log(data.rows)
        res.status(200).send("The Movie has been deleted");
        // res.status(204).json({});
    }).catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}

function getOneMovieHandler(req,res){
    let id = req.params.id;
    let sql = `SELECT * FROM addMovie WHERE id = ${id};`
    
    client.query(sql).then(data=>{
        // console.log(data.rows)
        res.status(200).json(data.rows);

    }).catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}




function addMovieHandler(req,res){
    const movie = req.body;
    //   console.log(movie)
    let sql = `INSERT INTO addMovie(title,comment) VALUES ($1,$2) RETURNING *;`
    let values = [movie.title,movie.comment];
    client.query(sql,values).then(data=>{
        // console.log(data.rows)
        res.status(201).json(data.rows);

    }).catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}

function getMovieHandler(req,res){

    let sql = `SELECT * FROM addMovie;`;
    client.query(sql).then(data=>{
        // console.log(data.rows)
        res.status(200).json(data.rows);

    }).catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}








// departments = Crew,Art,Writing,Visual Effects,Production,Camera,Directing,Editing,Sound,Lighting,Costume & Make-Up,Actors
// let departmentName = "Actors"
function jobsHandler(req,res){
    let departmentName = req.query.departmentName;
    // query can used only in GET function
    // http://localhost:3000/jobs?departmentName=Actors
    // localhost:PORT(endpoint such as (/jobs))(?)(query-params-name)=(query-params-value)
    let urlJobs = `https://api.themoviedb.org/3/configuration/jobs?api_key=${process.env.APIKEY}`
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
            InternalServerErrHandler(err,req,res);
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
    let urlTrending = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
    // let newArr = [];
    axios.get(urlTrending)
        .then((result)=>{
            // console.log(result.data.results)
            let movies = result.data.results.map(movie =>{
            return new NewMovies(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
        });
        res.status(200).json(movies)
        
        // res.status(200).json(movies);
        // result.data.results.forEach(movie =>{
        //     newArr.push(new Movies(movie.original_title,movie.poster_path,movie.overview);
        // })
        // res.status(200).json(newArr);

    }).catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}

function languagesHandler(req,res){
    let urlLanguages = `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.APIKEY}`
    axios.get(urlLanguages)
        .then((result)=>{
            // console.log(result.data)
            return res.status(200).json(result.data);
    })

    .catch((err)=>{
        InternalServerErrHandler(err,req,res);
    })
}



// let movieName = "Boruto: Naruto the Movie"
function searchMovieHandler(req,res){
    let movieName = req.query.movieName;
    // http://localhost:3000/search?movieName=Boruto: Naruto the Movie
    console.log(movieName)
    let urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2`
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
            InternalServerErrHandler(err,req,res);
    })

}


function notFoundHandler(req,res){
    return res.status(404).send("Not Found!!!")
}

function InternalServerErrHandler(error,req,res){

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


client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`)
    })

})









