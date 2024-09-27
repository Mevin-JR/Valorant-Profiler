const path = require('path');
const fs = require('fs');
const os = require('os');
const { child, ref , set, get, onValue, onChildAdded, query, orderByChild, startAt } = require("firebase/database");
const { auth, db } = require("./firebase");
const { hashPassword, verifyPassword } = require('./data_operations');
const { ipcMain, ipcRenderer } = require('electron');

const sessionFile = path.join(os.homedir(), "Valorant_Profiler", 'session.json');
const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));

// Register
async function registerUser(username, email, password) {
    try {
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
function saveSession(username, email) {
  const sessionData = {
    username: username,
    email: email,
    loginTime: new Date().toLocaleString()
  }
  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf-8');

  // Listening for live db changes
  // liveChanges()
}

async function accountInputData(name, tag) {
  try {
    const accountResponse = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
      method: 'GET',
      headers: {
          Authorization: 'HDEV-b123a86d-f239-49c4-93e5-39dc0479c05a' // TODO: Secure this
        }
    });
    const accountApiData = await accountResponse.json();

    const mmrResponse = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/${accountApiData.data.region}/pc/${name}/${tag}`, {
      method: 'GET',
      headers: {
          Authorization: 'HDEV-b123a86d-f239-49c4-93e5-39dc0479c05a' // TODO: Secure this
        }
    });
    const mmrApiData = await mmrResponse.json();
    
    const dbRef = ref(db, `userProfiles/${sessionData.username}`);
    const snapshot = await get(dbRef);
    var numOfAccounts = 0;
    if (snapshot.exists()) {
      const snapData = snapshot.val();
      numOfAccounts = Object.keys(snapData).length;
    }

    await set(ref(db, `userProfiles/${sessionData.username}/${numOfAccounts + 1}` ), {
      name: name,
      tag: tag,

      accLvl: accountApiData.data.account_level,
      puuid: accountApiData.data.puuid,
      region: accountApiData.data.region,
      cardImg: accountApiData.data.card.large,

      currentRank: mmrApiData.data.current.tier.name,
      peakRank: mmrApiData.data.peak.tier.name,
      currentElo: mmrApiData.data.current.elo,

      timestamp: Date.now(),
    });

  } catch (err) {
    console.error('Error adding account details:', err);
  }
}

async function getUserProfiles() {
  try {
    const userProfiles = [];
    const dbRef = ref(db, `userProfiles/${sessionData.username}` )
    const snapshot = await get(dbRef)

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
function liveChanges() {
  const dbRef = ref(db, `userProfiles/${sessionData.username}`);
  const queryRef = query(dbRef, orderByChild('timestamp'), startAt(Date.now()));

  onChildAdded(queryRef, (snapshot) => {
    const data = snapshot.val();

    const userProfiles = [];
    userProfiles.push({
      name: data.name,
      tag: data.tag,
      accLvl: data.accLvl,
      cardImg: data.cardImg
    })
    
    ipcRenderer.send('userProfile-update', userProfiles);
  });
}

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