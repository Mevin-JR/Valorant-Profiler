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
const passwordInput = document.getElementById("password-input");
const loginBtn = document.getElementById("login");
function login(e) {
    e.preventDefault();
    const username = usernameInput.value;
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

    // Password check
    if (password.length < min) {
        displayError("Password too short (Min. 4 chars)");
        return;
    } else if (password.length > max) {
        displayError("Password too long (Max. 24 chars)");
        return;
    }

    auth.loginUser(username, password)
    .then(status => {
        if (status === 200) {
            ipcRenderer.send('goto:mainMenu');
            return;
        } else if (status === 404) {
            displayError("Username does not exist")
            return;
        } else if (status === 401) {
            displayError("Incorrect Password");
            return;
        }
    });
}

loginBtn.addEventListener('click', login);

const gotoRegister = document.getElementById("goto-register");
gotoRegister.addEventListener('click', () => {
    ipcRenderer.send('goto:register')
});

const close = document.getElementById('close-btn');
close.addEventListener('click', () => {
    ipcRenderer.send('action:close')
});

const errorDisplay = document.getElementById('error-display')
function displayError(errorMsg) {
    errorDisplay.style.display = 'block';
    errorDisplay.textContent = errorMsg;
}