var Twitter = require("twitter");
var credentials = require("./credentials.json");
var twitterClient = new Twitter(credentials);
var redis = require("redis");

var services = null;
var redisCredentials = null;
if (process.env.VCAP_SERVICES) {
    services = JSON.parse(process.env.VCAP_SERVICES);
    redisCredentials = services["rediscloud"][0].credentials;
} else {
    redisCredentials = {
        "hostname": "127.0.0.1",
        "port": "6379",
        "password": null
    };
}
var redisClient = redis.createClient(redisCredentials.port, redisCredentials.hostname);
redisClient.auth(redisCredentials.password);

var createTweetCounter = function (searchTerms) {
    "use strict";

    var counts = {};
    redisClient.mget(searchTerms, function (err, redisCounts) {
        "use strict";
        if (err !== null) {
            console.error("error: " + err);
            return;
        }

        for (var i = 0; i < searchTerms.length; i++) {
            counts[searchTerms[i]] = parseInt(redisCounts[i], 10) || 0;
            console.log("'" + searchTerms[i] + "': " + counts[searchTerms[i]]);
        }
    });

    console.log("running tweet counter...");

    var params = {track: searchTerms.join(',')};
    twitterClient.stream('statuses/filter', params, function (stream) {
            "use strict";
            stream.on("data", function (tweet) {
                if (tweet && tweet.text) {
                    searchTerms.forEach(function (term) {
                        if (tweet.text.indexOf(term) > -1) {
                            counts[term] += 1;
                            redisClient.incr(term);
                        }
                    });
                }
            });

            stream.on("error", function (error) {
                console.error(error);
            });
        }
    );

    return counts;
};

module.exports = createTweetCounter;
