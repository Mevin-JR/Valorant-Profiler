const path = require('path');
const fs = require('fs');
const { child, ref , set, get } = require("firebase/database");
const { auth, db } = require("./firebase");
const { hashPassword, verifyPassword } = require('./data_operations');
const sessionFile = './session.json';

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
    const sessionData = {
      username: username,
      email: data.email,
      loginTime: new Date().toLocaleString()
    }
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), 'utf-8');

    return 200;

  } catch (err) {
    console.log('Error logging in user:', err);
  }
}

async function accountInputData(username, usernameInput, passwordInput) {
  try {
      // const dbRef = ref(db, 'accountInput/' + username);
      await set(ref(db, 'accountInput/' + username), {
        username: usernameInput,
        password: passwordInput
      });
  } catch (err) {
    console.err('Error adding account details:', err);
  }
}

// async function getAccInputData() {
//   try {
//     const dbData = ref(db, 'accountInput/' )
//   }
// }

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

module.exports = { registerUser, loginUser, log, accountInputData }