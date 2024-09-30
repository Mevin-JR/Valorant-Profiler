const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const path = require('path');

require('dotenv').config();

async function sendDataToBackend(data) {
    const response = await fetch('https://valorant-profiler.onrender.com/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log(result);
  }
  
  const sampleData = { key: 'value' };
  sendDataToBackend(sampleData);

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