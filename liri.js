require("dotenv").config();
//global variables
var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
//retrieves a command for gitbash
var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
   searchValue += process.argv[i] + " ";
}; 

//error function
 function errorFunction(respError) {
    if (respError) {
        return console.log("Error occured: ", respError);
     	}
	};

 ///////twitter ///////////////
 function getTweets() {
 		// Accesses Twitter Keys
 		var client = new Twitter(keys.twitter);
 		var params = {
 			screen_name: "CodeGuyK",
 		}

 			client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    		for (var i = 0; i < tweets.length; i++) {

    			console.log(i + 1 + ". Tweet: ", tweets[i].text);
    			console.log("    Tweeted on: ", tweets[i].created_at + "\n");
    			}
    		errorFunction();
  			}
		});
	}
	//what you search in gitbash this is part of my previous code to make the code display
	// if(process.argv[2] == "My-tweets") {
	// 	getTweets();
	// }

/////////Spotify/////////////////////////////////
//what you search in gitbash- this is part of my previous code to make the code display
	// if(process.argv[2] == "spotify-this-song") {
	// 	getSpotify();
	// }

function getSpotify () {

	var spotify = new Spotify(keys.spotify);
	//set a var for the paramaters songs we pass in gitbash
	//joined the multi-word titled songs .slice & .join
	var searchParam = process.argv.slice(3).join("+") ;
	console.log(searchParam);

	//if no song is entered then use this defualt song 
	if(process.argv[3] = null) {
		console.log("The Sign");
		} else {}


	//
	spotify.search({ type: 'track', query:searchParam }, function(err, data) {
 		if (err) {
    	return console.log('Error occurred: ' + err);
  		}

 //selecting things in the object to display
 var songData = data.tracks.items;

        for (var i = 0; i < songData.length; i++) {
            console.log("\n---------------- Spotify Search Result "+ (i+1) +" ----------------\n");
            console.log(("Artist: " + songData[i].artists[0].name));
            console.log(("Song title: " + songData[i].name));
            console.log(("Album name: " + songData[i].album.name));
            console.log(("URL Preview: " + songData[i].preview_url));
            console.log("\n------------------------------------------------------\n");

        }
		
	});

	
}

//////////////////////// OMDB movie-this /////////////////////////////////////
function searchMovie(searchValue) {
   // Default search value if no movie is given
   if (searchValue == "") {
       searchValue = "Mr. Nobody";
   }
   var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

   request(queryUrl, function(respError, response, body) {
       if (JSON.parse(body).Error == 'Movie not found!' ) {

           console.log("\nI'm sorry, I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n")        
       } else {

           movieBody = JSON.parse(body);
           console.log("\n-------------- OMDB Search Results -------------------\n");
           console.log("Movie Title: " + movieBody.Title);
           console.log("Year: " + movieBody.Year);
           console.log("IMDB rating: " + movieBody.imdbRating);

           // If there is no Rotten Tomatoes Rating
           if (movieBody.Ratings.length < 2) {
               console.log("There is no Rotten Tomatoes Rating for this movie.")                
           } else {

               console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);
           }      
               
           console.log("Country: " + movieBody.Country);
           console.log("Language: " + movieBody.Language);
           console.log("Plot: " + movieBody.Plot);
           console.log("Actors: " + movieBody.Actors);
           console.log("\n---------------------------------------------\n");

       };      
   });
};

// xxxxxxxxxxxxxxxxxx Random do-what-it-says xxxxxxxxxxxxxxxxxxxxxx
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(respError, data) {

        var randomArray = data.split(", ");

        errorFunction();

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else {
            getTweets();
        }
    });
};


// Runs corresponding function based on user command
switch (command) {
   case "my-tweets":
       getTweets();
       break;
   case "spotify-this-song":
       getSpotify();
       break;
   case "movie-this":
       searchMovie(searchValue);
       break;
   case "do-what-it-says":
       randomSearch();
       break;
   default:
       console.log("\nI'm sorry, " + command + " is not a command that I recognize. Please try one of the following commands: \n\n  1. For a random search: node liri.js do-what-it-says \n\n  2. To search a movie title: node liri.js movie-this (with a movie title following) \n\n  3. To search Spotify for a song: node liri.js spotify-this-song (*optional number for amount of returned results) (specify song title)\n     Example: node liri.js spotify-this-song 15 Candle in the Wind\n\n  4. To see the last 20 of Aidan Clemente's tweets on Twitter: node liri.js my-tweets \n");
};

