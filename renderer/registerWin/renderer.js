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
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const registerBtn = document.getElementById("register");

function register(e) {
    e.preventDefault();
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.registerUser(username, email, password)
    .then(() => {
        console.log('User registered successfully');
    });
}

registerBtn.addEventListener('click', register);

const gotoLogin = document.getElementById("goto-login");

gotoLogin.addEventListener('click', () => {
    ipcRenderer.send('goto:login')
})