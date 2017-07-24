var Twitter = require("twitter");
var credentials = require("./credentials.json");
var client = new Twitter(credentials);

var createTweetCounter = function (searchTerms) {
    "use strict";

    var counts = {};
    searchTerms.forEach(function (term) {
        "use strict";
        counts[term] = 0
    });

    console.log("running tweet counter...");

    var params = {track: searchTerms.join(',')};
    client.stream('statuses/filter', params, function (stream) {
            "use strict";
            stream.on("data", function (tweet) {
                if (tweet && tweet.text) {
                    searchTerms.forEach(function (term) {
                        if (tweet.text.indexOf(term) > -1)
                            counts[term] += 1;
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
