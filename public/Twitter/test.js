var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: "SKY5gLeHYexRhqsRN7iRWCn4Q",
    consumer_secret: "MdIcBO7KG4oqkYd2eVWqtzvDjDFaevlRvfIRJoIcZPcA1jabES",
    access_token_key: "2924664360-2C1KTcI5iiIsS9Cw8BjkVJ35TxCM6etAGrtJMNZ",
    access_token_secret: "n3H31MRfwDSNZbjUFFUeqBMjpgW3ZYjWRoj7I3ak8lvxW"
});

var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        console.log(tweets);
    } else {
        console.error(error);
    }
});
