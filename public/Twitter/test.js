var Twitter = require('twitter');
var credentials = require("./credentials.json");
var client = new Twitter(credentials);
console.log(client);

var params = {screen_name: 'philosofaster'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        console.log(tweets);
    } else {
        console.error(error);
    }
});
