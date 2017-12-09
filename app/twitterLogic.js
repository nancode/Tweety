var TwitterPackage = require('twitter');
var Stream = require('user-stream');
var Twit = require('twit');
const fs = require('fs');
var User = require('../app/models/user');
var array = [];
var openConnection = true;
var imgpath1;
var closeCall = function () {
  openConnection = false;
}
var twitterLogin = function (tokenSecret, token, username) {
  if (token !== undefined) {
    var stream = new Stream({
      consumer_key: 'MGEz3DiTLixGVcy9GDs720bUF',
      consumer_secret: 'sB867UryxejezrvrGySLSvt1TpjowaWU1GXOvNccUJXZMdgzJT',
      access_token_key: token,
      access_token_secret: tokenSecret
    });
    var T = new Twit({
      consumer_key: 'MGEz3DiTLixGVcy9GDs720bUF',
      consumer_secret: 'sB867UryxejezrvrGySLSvt1TpjowaWU1GXOvNccUJXZMdgzJT',
      access_token: token,
      access_token_secret: tokenSecret
    });

    openConnection = true;
    stream.stream();
    stream.on('data', function (json) {
      if (openConnection === false) {
        stream.stop();
      } else {
        console.log("sdfs");
        User.findOne({
          "local.count": { $gte: 1  } 
        }, function (err, user) {
          var str = './public/uploads/';
          console.log(user);
          var count ;
          var content ;
          var filename;
          var imgpath;
          if( user ===undefined || user === null){
            imgpath="ad_banner.jpg";
          }
          else{
            imgpath1 = "\"" + imgpath + "\"";
            filename = user.local.file_name;
            imgpath = str+ user.local.file_name;
            count = user.local.count;
          } 
          
          console.log("original count "+ count);
          content = fs.readFileSync(imgpath, {
            encoding: 'base64'
          });

          var userstatus = json.text;
          if (json.id_str !== undefined) {
            if (!(array.includes(json.id_str)) && (username === json.user.screen_name)) {
              T.post('media/upload', {
                media_data: content
              }, function (err, data, response) {

                var mediaIdStr = data.media_id_string;
                var altText = "ad";
                var meta_params = {
                  media_id: mediaIdStr,
                  alt_text: {
                    text: altText
                  }
                }
                T.post('media/metadata/create', meta_params, function (err, data, response) {
                  if (!err) {

                    var params = {
                      status: json.text,
                      media_ids: [mediaIdStr]
                    }
                    T.post('statuses/update', params, function (err, data, response) {
                      // console.log(data);
                      array.push(data.id_str);
                    })
                  }
                });
                T.post('statuses/destroy/:id', {
                  id: json.id_str
                }, function (error, tweet, response) {
                  if (error) {
                    console.log(error);
                  } else
                    console.log("Deletion and updation done!"); // Completion of task
                    count--;
                    console.log("subtracted count "+ count); 
                    console.log("path  "+ filename); 
                    User.update({"local.file_name":filename},{$set:{"local.count":count}},
                    function (err, user){
                      console.log("Final user"+ user)
                    });
                });
              });
            }
          }
        });
      }
    });
    stream.on('disconnect', function (disconnectMessage) {
      console.log("inside disconnect");
    })
  }
}
exports.twitterLogin = twitterLogin;
exports.closeCall = closeCall;