const path = require('path');
const fs = require('fs');
const { child, ref , set, get } = require("firebase/database");
const { auth, db } = require("./firebase");
const { hashPassword, verifyPassword } = require('./data_operations');

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

    return 200;
  } catch (err) {
    console.log('Error logging in user:', err);
  }
}

async function addAccountInputData(username, usernameInput, passwordInput) {
  try {
      const dbRef = ref(db, 'accountInput/' + )
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

module.exports = { registerUser, loginUser, log }