const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

async function fetchFirebaseConfigData() {
    const response = await fetch('https://valorant-profiler.onrender.com/firebaseConfig', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    console.log(result);
    return result;
}

const firebaseConfig = await fetchFirebaseConfigData();

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db };