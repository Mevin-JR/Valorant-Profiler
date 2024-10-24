const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

async function fetchFirebaseConfigData() {
    const response = await fetch('https://valorant-profiler.onrender.com/firebaseConfig', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
}

let db;
async function initializeFirebase() {
    if (!db) {
        const firebaseConfig = await fetchFirebaseConfigData();
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
    }

    return db;
}

module.exports = { initializeFirebase };