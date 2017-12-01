var TwitterPackage = require('twitter');
var Stream = require('user-stream');
var Twit = require('twit');
const fs = require('fs');
var User       = require('../app/models/user');
var array = [];
var twitterLogin = function(tokenSecret,token){
// my secret.json file looks like this:
// var stream = new Stream({
//   consumer_key: 'bBWQiDAcB870GQnm4H6Xo9Lah',
//   consumer_secret: 'XjgyGUjVE3xSMCwmC9uToETa4LK8yRD4On8IlNtUd1dNLCIW92',
//   access_token_key: token,
//   access_token_secret: tokenSecret
// }
// );
var stream = new Stream({
  consumer_key: 'EK5wP6mpzcYrp1Vipkdm18hHw',
  consumer_secret: 'wJWNSw8rFExvqr02aX9tTNvXWZspuOa61elcDz5N1be1XopCeS',
  access_token_key: token,
  access_token_secret: tokenSecret
}
);
  var T = new Twit({
    consumer_key: 'EK5wP6mpzcYrp1Vipkdm18hHw',
    consumer_secret: 'wJWNSw8rFExvqr02aX9tTNvXWZspuOa61elcDz5N1be1XopCeS',
    access_token: token,
    access_token_secret: tokenSecret
  }
);

var b64content = fs.readFileSync('banner.jpg', { encoding: 'base64' })
stream.stream();
  var i=0;
//listen stream data
stream.on('data', function(json) {
  console.log(json.id + " id");
  console.log(json.text + " text");
  var userstatus = json.text;
if( json.id_str !== undefined){
  if(i<1)
  // if(!( array.includes(tweet.id)))
  {
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and 
      // other text-based presentations and interpreters 
      var mediaIdStr = data.media_id_string;
      var altText = "a";
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet) 
          var params = { status: json.text, media_ids: [mediaIdStr] }
     
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data)
          })
        }
      });
    });
    T.post('statuses/destroy/:id', {id:json.id_str},  function(error, tweet, response){
      if(error){
                console.log(error);
              }
              else
              console.log("Work done!");  // Tweet body.
  });
  i++;


}
}
});
}
exports.twitterLogin = twitterLogin;