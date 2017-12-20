var keys = require("./keys.js");
var request = require("request");
// console.log("keys.sKeys", keys.sKeys);
// console.log("keys.tKeys", keys.tKeys);

var liri = {
    command: {
        twitter: "my-tweets",
        spotify: "spotify-this-song",
        omdb: "movie-this",
        random: "do-what-it-says"
    },
    method: {
        getNodeArg: function () {
            // var tempArg = "";
            // for (var i = 2; i < process.argv.length; i++) {
            //     if (i > 2 && i < process.argv.length) {
            //         tempArg = tempArg + "+" + process.argv[i];
            //     } else { tempArg += process.argv[i]; }
            // }
            return process.argv[2];
        },
        getQueryArg: function () {
            var tempArg = "";
            for (var i = 3; i < process.argv.length; i++) {
                if (i > 3 && i < process.argv.length) {
                    tempArg = tempArg + "+" + process.argv[i];
                } else { tempArg += process.argv[i]; }
            }
            return tempArg;
        }
    },
    action: {
        twitter: {
            requirement: "show last 20 tweets"
        },
        spotify: "based on the song name, return the artist(s), song name, preview link, the album. If the song was not found, default to Ace of base I saw the sign",
        omdb: {
            requirement: "Output title of movie, year the movie came out, IMDB and rotten tomatoes rating, country where it was produced, language of the movie, plot, actors in the movie. If no movie is entered, default to Mr. Nobody",
            movie: "Mr. Nobody",
            queryUrl: function () { return "http://www.omdbapi.com/?t=" + liri.action.omdb.movie + "&y=&plot=short&apikey=trilogy" },
            output: {
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
    random: "using 'fs' play the song in random.txt"
};

// var nodeArg = liri.command.getNodeArg();
// console.log(liri.command.getNodeArg());
switch (liri.method.getNodeArg()) {
    case liri.command.twitter:
        console.log("We are in the twitter case");
        break;
    case liri.command.spotify:
        console.log("We are in the spotify case");
        break;
    case liri.command.omdb:
        console.log("We are in the omdb case");
        liri.action.omdb.movie = liri.method.getQueryArg();
        // console.log("movie:" + liri.action.omdb.movie);
        console.log("QueryUrl:", liri.action.omdb.queryUrl());
        request(liri.action.omdb.queryUrl(), function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode === 200) {
                var returnObj = JSON.parse(body);
                // console.log("returnObj : " + returnObj);
                try {
                    liri.action.omdb.output.title.data = returnObj.Title;
                    console.log(liri.action.omdb.output.title.text, liri.action.omdb.output.title.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.title.text, liri.action.omdb.output.title.data);
                }
                try {
                    liri.action.omdb.output.year.data = returnObj.Year;
                    console.log(liri.action.omdb.output.year.text, liri.action.omdb.output.year.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.year.text, liri.action.omdb.output.year.data);
                }
                try {
                    liri.action.omdb.output.ratings[0].value.data = Ratings[0].Value;
                    console.log(liri.action.omdb.output.ratings[0].value.text, liri.action.omdb.output.ratings[0].value.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.ratings[0].value.text, liri.action.omdb.output.ratings[0].value.data);
                }
                try {
                    liri.action.omdb.output.ratings[1].value.data = Ratings[1].Value;
                    console.log(liri.action.omdb.output.ratings[1].value.text, liri.action.omdb.output.ratings[1].value.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.ratings[1].value.text, liri.action.omdb.output.ratings[1].value.data);
                }
                try {
                    liri.action.omdb.output.country.data = returnObj.Country;
                    console.log(liri.action.omdb.output.country.text, liri.action.omdb.output.country.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.country.text, liri.action.omdb.output.country.data);
                }
                try {
                    liri.action.omdb.output.language.data = returnObj.Language;
                    console.log(liri.action.omdb.output.language.text, liri.action.omdb.output.language.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.language.text, liri.action.omdb.output.language.data);
                }
                try {
                    liri.action.omdb.output.plot.data = returnObj.Plot;
                    console.log(liri.action.omdb.output.plot.text, liri.action.omdb.output.plot.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.plot.text, liri.action.omdb.output.plot.data);
                }
                try {
                    liri.action.omdb.output.actors.data = returnObj.Actors;
                    console.log(liri.action.omdb.output.actors.text, liri.action.omdb.output.actors.data);
                } catch (error) {
                    console.log(liri.action.omdb.output.actors.text, liri.action.omdb.output.actors.data);
                }
            }
        });
        break;
    case liri.command.random:
        console.log("We are in the random case");
        break;
    default:
        console.log("'" + liri.method.getNodeArg() + "' does not match a known command.");
        for (var key in liri.command) {
            console.log("Try: 'node liri.js " + liri.command[key] + "'");
        }
        break;
}