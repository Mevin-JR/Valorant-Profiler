const path = require('path');
const fs = require('fs');
const { child, ref , set, get } = require("firebase/database");
const { auth, db } = require("./firebase");
const { hashPassword, verifyPassword } = require('./data_operations');

const sessionFile = path.join(__dirname, 'session.json');
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

function saveSession(username, email) {
  const sessionData = {
    username: username,
    email: email,
    loginTime: new Date().toLocaleString()
  }
  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf-8');
}

async function accountInputData(name, tag) {
  try {
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
      method: 'GET',
      headers: {
          Authorization: 'HDEV-b123a86d-f239-49c4-93e5-39dc0479c05a'
        }
    });
    const apidata = await response.json();

    const dbRef = ref(db, `accountInput/${sessionData.username}`);
    const snapshot = await get(dbRef);
    var numOfAccounts = 0;
    if (snapshot.exists()) {
      const snapData = snapshot.val();
      numOfAccounts = Object.keys(snapData).length;
    }

    await set(ref(db, `accountInput/${sessionData.username}/${numOfAccounts + 1}` ), {
      name: name,
      tag: tag,
      accLvl: apidata.data.account_level,
      puuid: apidata.data.puuid,
      region: apidata.data.region,
      cardImg: `https://media.valorant-api.com/playercards/${apidata.data.card.id}/largeart.png`,
    });

  } catch (err) {
    console.error('Error adding account details:', err);
  }
}

async function getUserProfiles() {
  try {
    const userProfiles = [];
    const dbRef = ref(db, `accountInput/${sessionData.username}` )
    const snapshot = await get(dbRef)

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const acc in data) {
        if (data.hasOwnProperty(acc)) {
          userProfiles.push({
            name: data[acc].name,
            tag: data[acc].tag,
            cardImg: data[acc].cardImg
          })
        }
      }
    }

    return userProfiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
  }
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

module.exports = { registerUser, loginUser, log, accountInputData, getUserProfiles }