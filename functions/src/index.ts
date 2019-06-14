// The Cloud Functions for Firebase SDK o create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';

import * as nodemailer from 'nodemailer';

import * as cors from 'cors';
const corsHandler = cors({origin:true});

const mailTransport = nodemailer.createTransport(
    'smtps://eric@griffithnet.com:roflaeijbpemxdvf@smtp.gmail.com'
);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
  });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      // NOTE: Non-null assertion added to avoid typescript linting error msg
      return snapshot.ref.parent!.child('uppercase').set(uppercase) || 'err';
    });

exports.sendMail = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, () => {
        const to = req.body.to || 'garage-sale@griffithnet.com';
        const from = req.body.from || 'noemailincluded';
        const subject = req.body.subject || 'no subject';
        const message = req.body.message || 'no message';
        return sendEmail(to,from,subject,message).then( () => {
            res.status(200).send(req.query);
        }, (err) => { 
            res.status(300).send(err);
        })
    });
});

// pass an itemId to look up and increase the comment count
exports.updateCommentCount = functions.database.ref("/Comments/{commentId}/itemId").onWrite((snapshot, context) => {
    let itemId = snapshot.after.exists() ? snapshot.after.val() : snapshot.before.val();
    console.log(itemId);
    let countRef = admin.database().ref("/Items").child(itemId + '/commentCount');
    //let countRef = collectionRef.parent.child('likes_count');
  
    return countRef.transaction(function(current) {
      if (snapshot.after.exists()) {
        return (current || 0) + 1;
      }
      else if (!snapshot.after.exists()) {
        return (current || 0) - 1;
      }
    });
  });



function sendEmail(to: string, from: string, subject: string, message: string) {
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: message
    }
    return mailTransport.sendMail(mailOptions);
}