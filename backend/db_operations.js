const path = require('path');
const fs = require('fs');
const os = require('os');
const { ipcRenderer } = require('electron');

const { ref , set, get, onChildAdded, query, orderByChild, startAt, update } = require("firebase/database");
const { hashPassword, verifyPassword } = require('./data_operations');
const { initializeFirebase } = require("./firebase");

const sessionFile = path.join(os.homedir(), "Valorant_Profiler", 'session.json');

// Session file operations
function getSessionData() {
  try {
    const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
    return sessionData;
  } catch (error) {
    console.error('Error reading session file:', error);
  }
}

let sessionData = getSessionData();

// Register
async function registerUser(username, email, password) {
    try {
      const db = await initializeFirebase();
      const userRef = ref(db, 'users/' + username);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return 403;
      }

      const hashedPassword = await hashPassword(password);
      await set(ref(db, 'users/' + username), {
        username: username,
        email: email,
        password: hashedPassword
      });

      saveSession(username, email);

      return 200;
    } catch (err) {
      console.err('Error registering user:', err);
    }
}

// Login
async function loginUser(username, password) {
  try {
    const db = await initializeFirebase();
    const dbData = ref(db, 'users/' + username);
    const snapshot = await get(dbData);
    if (!snapshot.exists()) {
      return 404;
    }

    const data = snapshot.val();
    const passwordMatch = await verifyPassword(password, data.password);
    if (!passwordMatch) {
      return 401;
    }

    // Saving Session data
    saveSession(username, data.email);

    return 200;

  } catch (err) {
    console.log('Error logging in user:', err);
  }
}

// Session details
async function saveSession(username, email) {
  sessionData = {
    username: username,
    email: email,
    loginTime: new Date().toLocaleString()
  }
  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf-8');
}

async function fetchHenrikDevConfig() {
  const response = await fetch('https://valorant-profiler.onrender.com/henrikDevConfig', {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
  });

  const result = await response.json();
  return result;
}

async function accountApiRequest(name, tag) {
  try {
    const henrikDevConfig = await fetchHenrikDevConfig();
    const accountResponse = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
      method: 'GET',
      headers: {
          Authorization: henrikDevConfig.apiKey
        }
    });
    const accountApiData = await accountResponse.json();
    return accountApiData;
  } catch (error) {
    console.error('Error fetching account data from API:', error);
  }
}

async function mmrApiRequest(name, tag, region) {
  try {
    const henrikDevConfig = await fetchHenrikDevConfig();
    const mmrResponse = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/${region}/pc/${name}/${tag}`, {
      method: 'GET',
      headers: {
          Authorization: henrikDevConfig.apiKey
        }
    });
    const mmrApiData = await mmrResponse.json();
    return mmrApiData;
  } catch (error) {
    console.error('Error fetching account data from API:', error);
  }
}

async function valApiData(name, tag) {
  try {
    // TODO: Optimize api requests
    // Current rate limit 30req/min
    const accountApiData = await accountApiRequest(name, tag); 
    const mmrApiData = await mmrApiRequest(name, tag, accountApiData.data.region);
    const mergedApiData = { accountApiData, mmrApiData };
    return mergedApiData;
  } catch (error) {
    console.error('Error accessing henrikedev api:', error);
  }
}

async function accountInputData(name, tag) {
  try {
    const db = await initializeFirebase();
    const mergedApiData = await valApiData(name, tag);
    sessionData = getSessionData();
    await set(ref(db, `userProfiles/${sessionData.username}/${name}` ), {
      name: name,
      tag: tag,
      accLvl: mergedApiData.accountApiData.data.account_level,
      puuid: mergedApiData.accountApiData.data.puuid,
      region: mergedApiData.accountApiData.data.region,
      cardImg: mergedApiData.accountApiData.data.card.large,
      currentRank: mergedApiData.mmrApiData.data.current.tier.name,
      peakRank: mergedApiData.mmrApiData.data.peak.tier.name,
      currentElo: mergedApiData.mmrApiData.data.current.elo,
      timestamp: Date.now(),
    });

  } catch (err) {
    console.error('Error adding account details:', err);
  }
}

async function getUserProfiles() {
  try {
    const db = await initializeFirebase();
    sessionData = getSessionData();
    const dbRef = ref(db, `userProfiles/${sessionData.username}` )
    const snapshot = await get(dbRef)

    const userProfiles = [];

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const acc in data) {
        if (data.hasOwnProperty(acc)) {
          userProfiles.push({
            name: data[acc].name,
            tag: data[acc].tag,
            accLvl: data[acc].accLvl,
            cardImg: data[acc].cardImg,
            rank: data[acc].currentRank
          })
        }
      }
    }

    return userProfiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
  }
}

// Realtime changes
async function liveChanges() {
  // API refresh
  accountApiUpdate();
  mmrApiRequest();

  const db = await initializeFirebase();
  sessionData = getSessionData();
  const dbRef = ref(db, `userProfiles/${sessionData.username}`);
  const queryRef = query(dbRef, orderByChild('timestamp'));

  onChildAdded(queryRef, (snapshot) => {
    const data = snapshot.val();

    const userProfiles = [];
    userProfiles.push({
      name: data.name,
      tag: data.tag,
      accLvl: data.accLvl,
      cardImg: data.cardImg,
      rank: data.currentRank
    })
    
    ipcRenderer.send('userProfile-update', userProfiles);
  });
}

async function accountApiUpdate() { // TODO: Display update time of profile data
  try {
    const userProfiles = await getUserProfiles();
    const db = await initializeFirebase();

    for (const profile of userProfiles) {
      const { name, tag } = profile;
      sessionData = getSessionData();
      const userProfileRef = ref(db, `userProfiles/${sessionData.username}/${name}`);
      const snapshot = await get(userProfileRef);

      if (snapshot.exists()) {
        const accountApiData = await accountApiRequest(name, tag);
        const updatedProfile = {
          accLvl: accountApiData.data.account_level,
          puuid: accountApiData.data.puuid,
          region: accountApiData.data.region,
          cardImg: accountApiData.data.card.large,
          timestamp: Date.now(),
        };

        await update(userProfileRef, updatedProfile);
        console.log('Account data refreshed...')
      }
    }
  } catch (error) {
    console.error('Error during API update:', error);
  }
}

async function mmrApiUpdate() {
  try {
    const userProfiles = await getUserProfiles();
    const db = await initializeFirebase();

    for (const profile of userProfiles) {
      const { name, tag } = profile;
      sessionData = getSessionData();
      const userProfileRef = ref(db, `userProfiles/${sessionData.username}/${name}`);
      const snapshot = await get(userProfileRef);
      const data = snapshot.val();

      if (snapshot.exists()) {
        const mmrApiData = await mmrApiRequest(name, tag, data.region);
        const updatedProfile = {
          name: name,
          tag: tag,
          currentRank: mmrApiData.data.current.tier.name,
          peakRank: mmrApiData.data.peak.tier.name,
          currentElo: mmrApiData.data.current.elo,
          timestamp: Date.now(),
        };

        await update(userProfileRef, updatedProfile);
        console.log('Rank & MMR data refreshed...')
      }
    }
  } catch (error) {
    console.error('Error during API update:', error);
  }
}

setInterval(accountApiUpdate, 20 * 60 * 1000); // 20 min
setInterval(mmrApiUpdate, 30 * 60 * 1000); // 30 min

// Log
let parentDir  = path.join(__dirname, "..")
let logFile = path.join(parentDir,"vpLogs.txt");
let debug = false;

function log(logStatement) {
  var date = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();
  const formattedLogStatement = `\n[${date} | ${time}] ${logStatement}`
  if (debug) {
    fs.appendFile(logFile, formattedLogStatement, (err) => {
      if (err) {
          console.log(err);
          return;
      }
    });
  }
}

module.exports = { registerUser, loginUser, log, accountInputData, getUserProfiles, liveChanges }