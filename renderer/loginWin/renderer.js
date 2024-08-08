function hidePreloader() {
    const preloaderContainer = document.querySelector('.preloader-wrapper');
    const blackBg = document.querySelector('.black-bg');
    preloaderContainer.classList.add('fade-out');
    blackBg.classList.add('fade-out');
    setTimeout(() => {
        preloaderContainer.style.display = 'none';
        blackBg.style.display = 'none';
    }, 1000)
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        hidePreloader();
    }, 1000);
});

const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const loginBtn = document.getElementById("login");

function login(e) {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    auth.registerUser(username, password)
    .then(() => {
        console.log('User registered successfully');
        return auth.getUserData(username)
    })
    .then(userProfile => {
        if (userProfile) {
            console.log("Fetched user profile:", userProfile);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
    console.log(username, password);
}

loginBtn.addEventListener('click', login);

const gotoRegister = document.getElementById("goto-register");

gotoRegister.addEventListener('click', () => {
    ipcRenderer.send('goto:register')
})