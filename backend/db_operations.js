const path = require('path');
const fs = require('fs');
const { ipcRenderer } = require('electron');

const { ref , set, get, onChildAdded, query, orderByChild, update, startAt, startAfter } = require('firebase/database');
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

function getErrorStatus(status, apiData) {
  switch (status) {
    case 401:
      statusReturn = {status: 401, data: "Missing API key"};
      break;
    case 403:
      statusReturn = {status: 403, data: "Invalid API key"};
      break;
    case 404:
      const code = apiData.errors?.[0]?.code;
      switch (code) {
        case 22:
          statusReturn = {status: 404, data: "Account not found"};
          break;
        case 24:
          statusReturn = {status: 404, data: "Could not retrieve player data"};
          break;
        case 25:
          statusReturn = {status: 404, data: "No MMR data found for player"};
          break;
        default:
          statusReturn = {status: 404, data: "Could not fetch player data"};
          break;
      }
      break;
    case 429:
      statusReturn = {status: 429, data: "Rate limit reached, Please try again later"};
      break;
    case 500:
      statusReturn = {status: 500, data: "Internal error, Something went wrong"};
      break;
    default:
      statusReturn = {status: 0, data: accountResponse};
      break;
  }
  return statusReturn;
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

    const status = accountResponse.status;
    let accountApiData = await accountResponse.json();
    let statusReturn;
    if (status >= 200 && status < 300) {
      // FIXME: Add a check to see if this bitch is a json
      statusReturn = {status: status, data: accountApiData.data}
    } else {
      statusReturn = getErrorStatus(status, accountApiData);
    }
    return statusReturn;

  } catch (error) {
    console.error('Error fetching account data from API:', error);
  }
}

// TODO: Move the status check into a function and add it to mmr req as well
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
    console.error('Error fetching mmr data from API:', error);
  }
}

async function valApiData(name, tag) {
  try {
    // TODO: Optimize api requests, shits too much
    // Current rate limit 75req/min
    const accountApiData = await accountApiRequest(name, tag);
    if (accountApiData.status > 299) {
      ipcRenderer.send('error-code', accountApiData);
      return false;
    }
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
    if (!mergedApiData) {
      return;
    }
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

// FIXME: Why the fuck is this not registering on newly created accounts 
async function getLastRefreshed() {
  try {
    const db = await initializeFirebase();
    sessionData = getSessionData();
    const dbRef = ref(db, `userProfiles/${sessionData.username}`);
    const snapshot = await get(dbRef);

    let timestamp;
    if (snapshot.exists()) {
      const data = snapshot.val();
      timestamp = data.last_updated;
    } else {
      timestamp = Date.now();
    }
    return timestamp;
  } catch(err) {
    console.log(`Error fetching refresh timestamp: ${err}`)
  }
}

async function getUserProfiles() {
  try {
    const db = await initializeFirebase();
    sessionData = getSessionData();
    const dbRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles`);
    const queryRef = query(dbRef, orderByChild('name')); // FIXME: Shits broken, order this bitch by name
    const snapshot = await get(queryRef)

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
// TODO: Add secure firebase rules
// Realtime changes
async function liveChanges() {
  sessionData = getSessionData();
  const db = await initializeFirebase();

  let lastProfileAddedTimestamp = localStorage.getItem('lastProfileAddedTimestamp') || 0;

  const dbRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles`);
  const queryRef = query(dbRef, orderByChild('timestamp'), startAt(lastProfileAddedTimestamp)); // FIXME: Fix this shit

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
    console.log('Send');
    ipcRenderer.send('userProfile-update', userProfiles);

    localStorage.setItem('lastProfileAddedTimestamp', Date.now());
  });
}

async function refreshData() {
  try {
    await accountApiUpdate();
    await mmrApiUpdate();
    
    const updatedUserProfiles = await getUserProfiles();
    ipcRenderer.send('userProfile-refresh', updatedUserProfiles);
  } catch(err) {
    console.error(`Error refreshing data: ${err}`);
  }
}

async function accountApiUpdate() { // TODO: Display update time of profile data, fucking headache
  try {
    const userProfiles = await getUserProfiles();
    const db = await initializeFirebase();

    for (const profile of userProfiles) {
      const { name, tag } = profile;
      sessionData = getSessionData();
      const userProfileRef = ref(db, `userProfiles/${sessionData.username}/saved_profiles/${name}`);
      const snapshot = await get(userProfileRef);
      const accountApiData = await accountApiRequest(name, tag); // FIXME: Implement status code check in this bitch
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

    const lastUpdateRef = ref(db, `userProfiles/${sessionData.username}`);
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

module.exports = { registerUser, loginUser, accountInputData, getUserProfiles, liveChanges, getLastRefreshed, refreshData }