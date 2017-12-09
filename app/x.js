var TwitterPackage = require('twitter');
var Stream = require('user-stream');
var Twit = require('twit');
const fs = require('fs');
var User       = require('../app/models/user');
var array = [];
var openConnection = true;
var closeCall = function(){
  openConnection = false;
}
var twitterLogin = function(tokenSecret,token,username){
  if(token !== undefined){
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
openConnection = true;
img_path ='./public/uploads/Ads-1512357439932.jpg'
var b64content = fs.readFileSync(img_path, { encoding: 'base64' })
stream.stream();
  var i=0;

stream.on('data', function(json) {
  if(openConnection === false){
    stream.stop();
  }
  else{
  console.log(json.id + " id");
  console.log(json.text + " text");
  // console.log(json);
  var userstatus = json.text;
if( json.id_str !== undefined){

  // if(i<1){
  if(!( array.includes(json.id_str)) && (username === json.user.screen_name))
  {
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and 
      // other text-based presentations and interpreters 
      console.log("you are the user");

      var mediaIdStr = data.media_id_string;
      var altText = "a";
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
        
          var params = { status: json.text, media_ids: [mediaIdStr] }
           
            T.post('statuses/update', params, function (err, data, response) {
              console.log(data);
              array.push(data.id_str);
            })
        }
      });
      T.post('statuses/destroy/:id', {id:json.id_str},  function(error, tweet, response){
        if(error){
                  console.log(error);
                }
                else
                console.log("Work done!");  // Tweet body.
    });

    });
  


}
// i++;
}
  }
});
}
}
exports.twitterLogin = twitterLogin;
exports.closeCall = closeCall;
