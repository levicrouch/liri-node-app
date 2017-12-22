// add the required npm packages
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// set a variable for invoking the Twitter constructor
var client = new Twitter({
    consumer_key: keys.tKeys.consumer_key,
    consumer_secret: keys.tKeys.consumer_secret,
    access_token_key: keys.tKeys.access_token_key,
    access_token_secret: keys.tKeys.access_token_secret
});
// Set a variable for invoking the spotify constructor
var spotify = new Spotify({
    id: keys.sKeys.client_id,
    secret: keys.sKeys.client_secret
});

// Create an object to store various bits of data for use later
var liri = {
    command: {
        // Command line arguments we are explicitly looking for
        twitter: "my-tweets",
        spotify: "spotify-this-song",
        omdb: "movie-this",
        random: "do-what-it-says"
    },
    // Generic methods for getting the arguments from the commandline
    method: {
        getNodeArg: function () {
            return process.argv[2];
        },
        getQueryArg: function () {
            var tempArg = "";
            // grab the query keyword from the 4th index
            if (process.argv.length >= 4) {
                for (var i = 3; i < process.argv.length; i++) {
                    if (i > 3 && i < process.argv.length) {
                        tempArg = tempArg + "+" + process.argv[i];
                    } else { tempArg += process.argv[i]; }
                }
                return tempArg;
                // if we are missing the 4th and final index essentially the search query, then throw an error back to the user
            } else if (process.argv.length <= 3) {
                throw "Error: Missing a query";
                console.log("\nBe sure to enter a search term next time, mkay!?");
            }
        }
    },
    action: {
        twitter: {
            requirement: "show last 20 tweets",
            getTweets: function () {
                // grab the last 20 tweets and push into the temp array
                for (i = 0; i < 3; i++) {
                    arrTweets = liri.action.twitter.output.tweets.push(tweets[i].text);
                }
                return arrTweets;
            },
            writeConsole: function () {
                // output the tweets with a fancy border
                console.log(" ‛¯¯٭٭¯¯(▫▫)¯¯٭٭¯¯’")
                console.log("Tweets from: " + this.output.user)
                for (i = 0; i < liri.action.twitter.output.tweets.length; i++) {
                    console.log("Tweet " + i + ": " + liri.action.twitter.output.tweets[i]);
                }
                console.log(" ‛¯¯٭٭¯¯(▫▫)¯¯٭٭¯¯’")
            },
            output: {
                tweets: [],
                user: ""
            }
        },
        spotify: {
            requirement: "based on the song name, return the artist(s), song name, preview link, the album. If the song was not found, default to Ace of base I saw the sign",
            query: "I Want it That Way",
            baseUrl: "https://api.spotify.com/v1/search/q=name:",
            queryUrl: function () { return this.baseUrl + liri.action.spotify.query + "&type=track" },
            writeConsole: function () {
                // write to the console with a boombox ascii art
                console.log("♫♪.ılılıll|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|llılılı.♫♪")
                for (key in this.output) {
                    console.log(key + ": " + this.output[key]);
                }
                console.log("♫♪.ılılıll|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|llılılı.♫♪")
            },
            output: {
                // placeholder properties
                artistName: "",
                songName: "",
                albumName: "",
                trackUrl: "",
                artistUrl: "",
                previewUrl: ""
            }
        },
        omdb: {
            requirement: "Output title of movie, year the movie came out, IMDB and rotten tomatoes rating, country where it was produced, language of the movie, plot, actors in the movie. If no movie is entered, default to Mr. Nobody",
            movie: "Mr. Nobody",
            queryUrl: function () { return "http://www.omdbapi.com/?t=" + liri.action.omdb.movie + "&y=&plot=short&apikey=trilogy" },
            output: {
                // deafult text for movies that may be missing bits of data
                title: {
                    data: "Sorry, no title data was found",
                    text: "Title:"
                },
                year: {
                    data: "Sorry, no year data was found",
                    text: "Year:"
                },
                ratings: [{
                    source: "IMDB",
                    value: {
                        data: "Sorry, no IMDB rating was found",
                        text: "IMDB Rating:"
                    }
                },
                {
                    source: "Rotten Tomatoes",
                    value: {
                        data: "Sorry, no Rotten Tomatoes rating was found",
                        text: "Rotten Tomatoes Rating:"
                    }
                }
                ],
                country: {
                    data: "Sorry, no country data was found",
                    text: "Country:"
                },
                language: {
                    data: "Sorry, no language data was found",
                    text: "Language:"
                },
                plot: {
                    data: "Sorry, no plot data was found",
                    text: "Plot Synopsis:"
                },
                actors: {
                    data: "Sorry, no actor data was found",
                    text: "Actors:"
                }
            }
        }
    },
    random: {
        requirement: "using 'fs' play the song in random.txt",
        // aside from 'I want it that way' i actually like each of these songs. Since they 
        // reflect my music tastes and span a broad spectrum, it seemed fitting to include them in the spirit of 'randomness' 
        songArr: ["I Want it That Way", "Egyptian Reggae", "broccoli", "Istanbul", "I Spy", "all my ex's live in texas", "thunderhorse"],
        generateRandom: function () {
            // generate a random number with a range of 0 to the length of the array 
            var rndNum = Math.floor(Math.random() * this.songArr.length) + 0;
            return rndNum;
        }
    }

};

switch (liri.method.getNodeArg()) {
    case liri.command.twitter:
        // get tweets from the late comedian Mitch Hedberg
        var params = { screen_name: 'M_Hedberg' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                // grab the user name from the twitter account
                liri.action.twitter.output.user = tweets[0].user.name;
                for (i = 0; i < 20; i++) {
                    // grab the last 20 tweets and push them up to an array in the liri object
                    liri.action.twitter.output.tweets.push(tweets[i].text);
                }
                // write the tweets and additional data to the console
                liri.action.twitter.writeConsole();
            }
        });
        break;
    case liri.command.spotify:
        try {
            // grab the search term using getQueryArg method
            liri.action.spotify.query = liri.method.getQueryArg();
        } catch (error) {
            console.log(error);
            break;
        }
        spotify
            .search({ type: 'track', query: liri.action.spotify.query, limit: 2 })
            .then(function (data) {
                // take the data and ad it to the object and then output to the console
                liri.action.spotify.output.artistName = data.tracks.items[0].artists[0].name;
                liri.action.spotify.output.albumName = data.tracks.items[0].album.name;
                liri.action.spotify.output.artistUrl = data.tracks.items[0].artists[0].external_urls.spotify;
                liri.action.spotify.output.trackUrl = data.tracks.items[0].external_urls.spotify;
                liri.action.spotify.output.songName = data.tracks.items[0].name;
                liri.action.spotify.output.previewUrl = data.tracks.items[0].preview_url;
                if (liri.action.spotify.output.artistName == "" || liri.action.spotify.output.songName == "") {
                    liri.action.spotify.output.songName = "The Sign";
                    liri.action.spotify.output.artistName = "Ace of Base";
                }
                liri.action.spotify.writeConsole();
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
        break;
    case liri.command.omdb:
        // set the movie property by invoking the getQueryArg
        liri.action.omdb.movie = liri.method.getQueryArg();
        // generate a request by invoking the queryUrl method
        request(liri.action.omdb.queryUrl(), function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode === 200) {
                var returnObj = JSON.parse(body);
                // For some reason not all responses from omdb have all properties defined that we are looking for
                // So, we wrap up each attempt to set the values in a try catch so the user does not see an error 
                try {
                    // grab the move title and populate the object property
                    liri.action.omdb.output.title.data = returnObj.Title;
                    console.log(liri.action.omdb.output.title.text, liri.action.omdb.output.title.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.title.text, liri.action.omdb.output.title.data);
                }
                try {
                    // grab the year the movie was made
                    liri.action.omdb.output.year.data = returnObj.Year;
                    console.log(liri.action.omdb.output.year.text, liri.action.omdb.output.year.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.year.text, liri.action.omdb.output.year.data);
                }
                try {
                    // grab the IMDB ratings index=0
                    liri.action.omdb.output.ratings[0].value.data = returnObj.Ratings[0].Value;
                    console.log(liri.action.omdb.output.ratings[0].value.text, liri.action.omdb.output.ratings[0].value.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.ratings[0].value.text, liri.action.omdb.output.ratings[0].value.data);
                }
                try {
                    // Grab the rotten tomatoes rating
                    liri.action.omdb.output.ratings[1].value.data = returnObj.Ratings[1].Value;
                    console.log(liri.action.omdb.output.ratings[1].value.text, liri.action.omdb.output.ratings[1].value.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.ratings[1].value.text, liri.action.omdb.output.ratings[1].value.data);
                }
                try {
                    // grab the country data
                    liri.action.omdb.output.country.data = returnObj.Country;
                    console.log(liri.action.omdb.output.country.text, liri.action.omdb.output.country.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.country.text, liri.action.omdb.output.country.data);
                }
                try {
                    // grab the language
                    liri.action.omdb.output.language.data = returnObj.Language;
                    console.log(liri.action.omdb.output.language.text, liri.action.omdb.output.language.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.language.text, liri.action.omdb.output.language.data);
                }
                try {
                    // grab the plot
                    liri.action.omdb.output.plot.data = returnObj.Plot;
                    console.log(liri.action.omdb.output.plot.text, liri.action.omdb.output.plot.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.plot.text, liri.action.omdb.output.plot.data);
                }
                try {
                    // grab the actors
                    liri.action.omdb.output.actors.data = returnObj.Actors;
                    console.log(liri.action.omdb.output.actors.text, liri.action.omdb.output.actors.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.actors.text, liri.action.omdb.output.actors.data);
                }
            }
        });
        break;
    case liri.command.random:
        // tweaking the requirement here a bit. Adding a random number generator to pick from an array of random songs
        // The do while loop is designed to prevent attempts to grab an index that is outside of the array and thus an error
        // essentially, if the random number is larger than the array, generate a new random number that is less than the maximum indexes
        do {
            randomNumber = liri.random.generateRandom();
        }
        while (randomNumber >= liri.random.songArr.length)
        // create a string to populate the file on disk with the argument and song
        var writeString = "spotify-this-song," + liri.random.songArr[randomNumber];
        // write the random song to random.txt
        fs.writeFile("random.txt", writeString, function (error) {
            if (error) {
                console.log(error);
            }
        });
        // read the random song from random.txt
        fs.readFile("random.txt", "utf8", function (error, data) {
            console.log(data);
            var dataArr = data.split(",");
            // split the data and use the second index as the search query
            liri.action.spotify.query = dataArr[1];
            // call spotify with the random song
            spotify
                .search({ type: 'track', query: liri.action.spotify.query, limit: 2 })
                .then(function (data) {
                    // write the data to the object
                    liri.action.spotify.output.artistName = data.tracks.items[0].artists[0].name;
                    liri.action.spotify.output.albumName = data.tracks.items[0].album.name;
                    liri.action.spotify.output.artistUrl = data.tracks.items[0].artists[0].external_urls.spotify;
                    liri.action.spotify.output.trackUrl = data.tracks.items[0].external_urls.spotify;
                    liri.action.spotify.output.songName = data.tracks.items[0].name;
                    liri.action.spotify.output.previewUrl = data.tracks.items[0].preview_url;
                    if (liri.action.spotify.output.artistName == "" || liri.action.spotify.output.songName == "") {
                        liri.action.spotify.output.songName = "The Sign";
                        liri.action.spotify.output.artistName = "Ace of Base";
                    }
                    // write the song data to the console
                    liri.action.spotify.writeConsole();
                })
                .catch(function (err) {
                    console.error('Error occurred: ' + err);
                });
        });
        break;
    default:
        // helper message to give the user the expected commandline arguments, in case of typos or just not knowing what to use
        console.log("'" + liri.method.getNodeArg() + "' does not match a known command.");
        for (var key in liri.command) {
            console.log("Try: 'node liri.js " + liri.command[key] + "'");
        }
        break;
}