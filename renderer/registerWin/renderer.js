function hidePreloader() {
    const preloaderContainer = document.querySelector('.preloader-wrapper');
    preloaderContainer.classList.add('fade-out');
    setTimeout(() => {
        preloaderContainer.style.display = 'none';
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

    var min = 4;
    var max = 24;

    // Username validity
    if (username.length < min) {
        displayError("Username too short (Min. 4 chars)");
        return;
    } else if (username.length > max) {
        displayError("Username too long (Max. 24 chars)");
        return;
    }

    // Email check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        displayError("Invalid email address")
        return;
    }

    // Password check
    if (password.length < min) {
        displayError("Password too short (Min. 4 chars)");
        return;
    } else if (password.length > max) {
        displayError("Password too long (Max. 24 chars)");
        return;
    }

    auth.registerUser(username, email, password)
    .then(status => {
        if (status === 200) {
            ipcRenderer.send('goto:mainMenu');
            return;
        } else if (status === 403) {
            displayError("Username already exists");
            return;
        }
    });
}

registerBtn.addEventListener('click', register);

const gotoLogin = document.getElementById("goto-login");
gotoLogin.addEventListener('click', () => {
    ipcRenderer.send('goto:login')
})

const close = document.getElementById('close-btn');
close.addEventListener('click', () => {
    ipcRenderer.send('action:close')
});

const errorDisplay = document.getElementById('error-display')
function displayError(errorMsg) {
    errorDisplay.style.display = 'block';
    errorDisplay.textContent = errorMsg;
}