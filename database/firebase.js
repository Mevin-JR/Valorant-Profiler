const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log(process.env)

const firebaseConfig = {
    apiKey: `${process.env.FIREBASE_API_KEY}`,
    authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
    databaseURL: `${process.env.FIREBASE_DATABASE_URL}`,
    projectId: `${process.env.FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
    appId: `${process.env.FIREBASE_APP_ID}`,
    measurementId: `${process.env.FIREBASE_MEASUREMENT_I}`,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db };