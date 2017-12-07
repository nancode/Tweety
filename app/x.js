var TwitterPackage = require('twitter');
var Stream = require('user-stream');
var Twit = require('twit');
const fs = require('fs');
var User       = require('../app/models/user');
var array = [];
var twitterLogin = function(tokenSecret,token){
// my secret.json file looks like this:
// var stream = new Stream({
//   consumer_key: 'EK5wP6mpzcYTTTrp1Vipkdm18hHw',
//   consumer_secret: 'wJWNSw8rFExvqr02aX9tTNvXWZTTTspuOa61elcDz5N1be1XopCeS',
//   access_token_key: token,
//   access_token_secret: tokenSecret
// }
// );
var stream = new Stream({
  consumer_key: 'MGEz3DiTLixGVcy9GDs720bUF',
  consumer_secret: 'sB867UryxejezrvrGySLSvt1TpjowaWU1GXOvNccUJXZMdgzJT',
  access_token_key: token,
  access_token_secret: tokenSecret
}
);
  var T = new Twit({
    consumer_key: 'MGEz3DiTLixGVcy9GDs720bUF',
    consumer_secret: 'sB867UryxejezrvrGySLSvt1TpjowaWU1GXOvNccUJXZMdgzJT',
    access_token: token,
    access_token_secret: tokenSecret
  }
);

var b64content = fs.readFileSync('banner.jpg', { encoding: 'base64' })
stream.stream();
  var i=0;

stream.on('data', function(json) {
  console.log(json.id + " id");
  console.log(json.text + " text");
  var userstatus = json.text;
if( json.id_str !== undefined){
  if(i<1)
  
  {
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
     
      var mediaIdStr = data.media_id_string;
      var altText = "a";
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
        
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
              console.log("Work done!"); 
  });
  i++;


}
}
});
}
exports.twitterLogin = twitterLogin;