const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like
app.use(cors());

const playstore = require('./playstore-data');

app.get('/apps', (req,res) => {
    const { search = "", sort, genres } = req.query;

    if (sort) {    
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app');
        }
    }
    if (genres) {    
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app');
        }
    }
    let results = playstore
        .filter(play => 
            play
                .App
                .toLowerCase()
                .includes(search.toLowerCase()));
                
    let genresResults = playstore
            .filter(genresPlay =>
                genresPlay
                    .Genres
                    .toLowerCase()
                    .includes(search.toLowerCase()));
    // After the app results are filtered by the search, then we can sort:
    if (sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ?1 : a[sort] < b[sort] ? -1: 0;
        });
    }
    if (genres) {
        genresResults.genres((a, b) => {
            return a[genres] > b[genres] ?1 : a[genres] < b[genres] ? -1: 0;
        });
    }
    res
    .json(results);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
  });