const express = require('express');
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

app.get('/firebaseConfig', (req, res) => {
    res.json(firebaseConfig);
});

app.get('/henrikDevConfig', (req, res) => {
    const data = {
        apiKey: process.env.HENRIKDEV_API_KEY
    };
    res.json(data);
});

let db;
async function initializeFirebase() {
    if (!db) {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        console.log('Initialized Firebase')
    }

    return db;
}

async function pingFirebase() {
    try {
        db = initializeFirebase();
        const dbRef = ref(db, 'ping/');
        await set(dbRef, {
            last_pinged: new Date()
        });
        console.log('Ping successful, Firebase connection is warm')
    } catch(error) {
        console.error('Error pinging firebase:', error);
    }
}

setInterval(pingFirebase, 1 * 60 * 1000);

app.listen(port, () => {
    initializeFirebase();
    console.log(`Server is running on port ${port}`);
});