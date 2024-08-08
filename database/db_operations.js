const { child, ref , get, set} = require("firebase/database");
const { auth, db } = require("./firebase");

// Register
function registerUser(username, email, password) {
    set(ref(db, 'users/' + username), {
      username: username,
      email: email,
      password: password
    })
    .then(() => {
      console.log("User registeration successfull!");
    })
}

// Login
async function loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Error logging in user:', error.message);
    }
}

// User data
async function getUserData(username) {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `userProfiles/${username}`)); // TODO: Fix this abomination
    if (snapshot.exists()) {
      const userProfile = snapshot.val()
      console.log('User profile:', userProfile);
      return userProfile;
    } else {
      console.log('No data available');
      return null;
    }
  } catch(error) {
    console.error('Error fetching user profile:', error);
  }
}

module.exports = { registerUser, loginUser, getUserData }