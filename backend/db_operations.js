const path = require('path');
const fs = require('fs');
const { ipcRenderer } = require('electron');

const { ref , set, get, onChildAdded, query, orderByChild, update } = require('firebase/database');
const { hashPassword, verifyPassword } = require('./utils');
const { initializeFirebase } = require("./firebase");

const sessionFile = path.join(process.env.APPDATA, 'Valorant Profiler', 'session.json');

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
async function registerUser(username, password) {
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
        password: hashedPassword
      });

      saveSession(username);

      return 200;
    } catch (err) {
      console.err('Error registering user:', err);
    }
}

// Login
async function loginUser(username, password = '') {
  try {
    const db = await initializeFirebase();
    const dbData = ref(db, 'users/' + username);
    const snapshot = await get(dbData);

    if (!snapshot.exists()) {
      return 404;
    }

    const data = snapshot.val();
    if (password !== '') {
      const passwordMatch = await verifyPassword(password, data.password);
      if (!passwordMatch) {
        return 401;
      }
    }

    // Saving Session data
    saveSession(username);

    return 200;

  } catch (err) {
    console.log('Error logging in user:', err);
  }
}

// Session details
async function saveSession(username) {
  sessionData = {
    username: username,
    loginTime: Date.now()
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
    await set(ref(db, `userProfiles/${sessionData.username}/saved_profiles/${name}` ), {
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
    const dbRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles` )
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

// TODO: Serialize api refresh
// Realtime changes
async function liveChanges() {
  accountApiUpdate();
  mmrApiUpdate();
  sessionData = getSessionData();
  const db = await initializeFirebase();
  const dbRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles`);
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
    });
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
      const userProfileRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles/${name}`);
      const snapshot = await get(userProfileRef);
      const accountApiData = await accountApiRequest(name, tag);
      const updatedProfile = {
        accLvl: accountApiData.data.account_level,
        puuid: accountApiData.data.puuid,
        region: accountApiData.data.region,
        cardImg: accountApiData.data.card.large,
        timestamp: Date.now(),
      };

      if (snapshot.exists()) {
        await update(userProfileRef, updatedProfile);
      } else {
        await set(userProfileRef, updatedProfile);
      }
    }

    const lastUpdateRef = ref(db, `userProfiles/${sessionData.username}/last_updated`);
    const lastUpdateSnapshot = await get(lastUpdateRef);
    const currentTimestamp = Date.now();

    if (lastUpdateSnapshot.exists()) {
      await update(lastUpdateRef, { last_updated: currentTimestamp });
    } else {
      await set(lastUpdateRef, { last_updated: currentTimestamp });
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
      const userProfileRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles/${name}`);
      const snapshot = await get(userProfileRef);
      const data = snapshot.val();
      const mmrApiData = await mmrApiRequest(name, tag, data.region);
      const updatedProfile = {
        name: name,
        tag: tag,
        currentRank: mmrApiData.data.current.tier.name,
        peakRank: mmrApiData.data.peak.tier.name,
        currentElo: mmrApiData.data.current.elo,
        timestamp: Date.now(),
      };

      if (snapshot.exists()) {
        await update(userProfileRef, updatedProfile);
      } else {
        await set(userProfileRef, updatedProfile);
      }
    }
  } catch (error) {
    console.error('Error during API update:', error);
  }
}

setInterval(accountApiUpdate, 20 * 60 * 1000); // 20 min
setInterval(mmrApiUpdate, 30 * 60 * 1000); // 30 min

module.exports = { registerUser, loginUser, accountInputData, getUserProfiles, liveChanges }