# liri-node-app

Liri is a command-line-interface (CLI) application that can search the web for various items. Use liri to lookup movie information, spotify songs, and retrieve tweets. All information is returned via the CLI.

# Usage:
When using liri be sure to use the following commands to return information:

"my-tweets" - Returns the last 20 tweets from the late great comedian Mitch Hedberg.

"spotify-this-song <song-name>" - Returns the artist, album, and track preview links from Spotify.

"movie-this <movie-name>" - Returns the the title, year, IMDB and rotten tomatoes ratings, country, language(s), plot synopsis, and the actors in the movie.

"do-what-it-says" - Returns the spotify information for a random song. The songs reflect my eclectic tastes in music from heavy-metal, rap, and some quite twangy country music that I have had the privilege to experience throughout my life. Hope you enjoy the selections.

# Technical notes:
Liri uses Node.js as a framework along with:
"fs" - a node package that allows us to read/write data to the local file system. https://www.npmjs.com/package/fs
"node-spotify-api" - a node package that allows us to pull data from the spotify API. https://www.npmjs.com/package/node-spotify-api
"request" - a node package that allows us to make requests to the OMDB API and pull movie data. https://www.npmjs.com/package/request and http://www.omdbapi.com/
"twitter" - a node package that allows us to pull in tweets from the twitter API. https://www.npmjs.com/package/twitter
