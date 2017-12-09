Tweety Tweeple:

Install dependencies using "npm install"
Start the server using "npm start"
Go to localhost:3000

=============================
Set up the Ad poster profile
==============================
Sign up as a new user first to set up the app. 
(Before signing into to twitter we need to upload the ads first)

Upload an image to be displayed as an ad and then enter a number in the "No of times .." field to purchase ad.

You should be able to see the preview of the image.


===========================================
Authorize Tweety Tweeple - the Twitter App
==========================================
Click on the Twitter button to authorize the app to access your twitter account.
Provide your Twitter Credentials.



===============================
Post a Tweet
===============================
Now go to twitter.com and post a tweet and refresh the page.
The tweet appears with the ad that was uploaded. 
In case there are no more ads to be displayed, default ad is shown (ad_banner.jpg in the server)



============================
Unlinking Tweety Tweeple
============================
Unlinking of the App could be done by using "Unlink" button.
Tweeple will not post ads after this stage until it has been linked again.


Important:

Everytime the server is restarted it is essestion that localhost:3000 is set up and twitter is linked to the app else the app is crash. 
The ads that are uploaded are uploaded to the server and not to the DB. Therefore default will appear when the ads are not present in the local server.


=====
Team 
=====
Vijaya Nandhini Sivaswamy - vsivas2@uic.edi (github : nancode)
Sunil Kumar VR - svinay5@uic.edu (github : svinay93)
Santhosh Mani - smani6@uic.edu (github : santhoshmani, santhoshmani888)

================
Responsibilities
=================
Vijaya Nandhini Sivaswamy  - Twitter logic implementation
Sunil Kumar VR - Ad upload
Santhosh Mani - OAuth & Database part
