const visionApi = require('@google-cloud/vision')();
const functions = require('firebase-functions');
const fs = require('fs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  console.log(matches[2]);
  response.data = new Buffer(matches[2], 'base64');

  return response;

}

exports.vision = functions.https.onRequest((request, response) => {
  const data = JSON.parse(request.body);

  const image = decodeBase64Image(data.image);
  console.log(image);

  fs.writeFile('/tmp/image.jpeg', image.data, (err) => {
    if (err) {
      console.error(err);
    } else {
      visionApi.detectLabels('/tmp/image.jpeg', (err, images, apiResponse) => {
        if (err) {
          console.error(err);
        } else {
          console.log(images);
          console.log(apiResponse.webDetection);
    
          response.send(images);
        }
      })
    }
  })
})