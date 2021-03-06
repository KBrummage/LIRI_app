require("dotenv").config();

var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var argumentA = process.argv[2];
var argumentB = process.argv[3];

if (argumentA === "concert-this") {
    concertThis(argumentB);
} else if (argumentA === "spotify-this-song") {
    spotifyThisSong(argumentB);
} else if (argumentA === "movie-this") {
    movieThis(argumentB);
} else if (argumentA === "do-what-it-says") {
    doWhatItSays();
}

function concertThis(argumentB) {
    appendInput(argumentA, argumentB)

    var queryURL = `https://rest.bandsintown.com/artists/${argumentB}/events?app_id=codingbootcamp`
    request(queryURL, function (error, response, body) {
        //   console.log('error:', error); // Print the error if one occurred
        //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //   console.log('body:', JSON.parse(body)[0].venue.name); // Print the HTML for the Google homepage.
        if (!error && response.statusCode === 200) {
            var venueName = JSON.parse(body)[0].venue.name;
            var venueLocation = `${JSON.parse(body)[0].venue.city}, ${JSON.parse(body)[0].venue.region}`;
            var startDate = moment(JSON.parse(body)[0].datetime).format('L');
            console.log(`            Venue: ${venueName}
            Location: ${venueLocation}
            Date of Event: ${startDate}`);
        }
    });
};

function spotifyThisSong(argumentB) {
    appendInput(argumentA, argumentB)

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({
        type: 'track',
        query: argumentB
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < 20; i++) {
            var artist = JSON.stringify(data.tracks.items[i].album.artists[0].name);
            var songName = JSON.stringify(data.tracks.items[i].name);
            var previewLink = JSON.stringify(data.tracks.items[i].album.external_urls.spotify, null, 2);
            var album = JSON.stringify(data.tracks.items[i].album.name);
            console.log(`---${i+1}--------------`)
            console.log(`Song: ${songName}
Artist: ${artist}
Album: ${album}
Spotify Link: ${previewLink}`)
        }

    });

};

function movieThis(argumentB) {
    appendInput(argumentA, argumentB)

    // var argumentB = process.argv[3];
    var queryURL = `http://www.omdbapi.com/?t=${argumentB}&y=&plot=short&apikey=trilogy`
    request(queryURL, function (error, response, body) {
        //   console.log('error:', error); // Print the error if one occurred
        //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //   console.log('body:', JSON.parse(body)[0].venue.name); // Print the HTML for the Google homepage.
        if (!error && response.statusCode === 200) {
            var MovieInfo = JSON.parse(body);
            console.log(`Title: ${argumentB}
Year: ${MovieInfo.Year}
IMDB Rating: ${MovieInfo.imdbRating}
Rotten Tomatoes Rating: ${MovieInfo.Ratings[1]}
Country: ${MovieInfo.Country}
Language: ${MovieInfo.Language}
Plot: ${MovieInfo.Plot}
Actors: ${MovieInfo.Actors}`)
        }
    });
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.split(',');
        argumentA = data[0];
        if (argumentA === "concert-this") {
            concertThis(data[1]);
        } else if (argumentA === "spotify-this-song") {
            spotifyThisSong(data[1]);
        } else if (argumentA === "movie-this") {
            movieThis(data[1]);
        }


    })
}

function appendInput(argA, argB){
    fs.appendFile('log.txt', `${argA}, ${argB}\n`, 'utf8', (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
      
}