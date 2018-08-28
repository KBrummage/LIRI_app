require("dotenv").config();

var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');

var argumentA = process.argv[2];
var argumentB = process.argv[3];
var request = require('request');

if (argumentA === "concert-this") {
    concertThis();
} else if (argumentA === "spotify-this-song") {
    spotifyThisSong();
} else if (argumentA === "movie-this") {
    movieThis();
} else if (argumentA === "do-what-it-says") {
    doWhatItSays();
}

function concertThis(argumentB) {
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
    console.log(keys.spotify.id);
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({
        type: 'track',
        query: "down"
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < 20; i++) {
            var artist = JSON.stringify(data.tracks.items[i].album.artists[0].name);
            var songName = JSON.stringify(data.tracks.items[i].name);
            var previewLink = JSON.stringify(data.tracks.items[i].album.external_urls.spotify, null, 2);
            var album = JSON.stringify(data.tracks.items[i].album.name);
            console.log(`---${i}--------------`)
            console.log(`Song: ${songName}
Artist: ${artist}
Album: ${album}
Spotify Link: ${previewLink}`)
        }

    });

};
// var movieThis = function(){};
// var doWhatItSays = function(){};