const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/firebaseConfig', (req, res) => {
    const data = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };
    res.json(data);
});

app.get('/henrikDevConfig', (req, res) => {
    const data = {
        apiKey: process.env.HENRIKDEV_API_KEY
    };
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});