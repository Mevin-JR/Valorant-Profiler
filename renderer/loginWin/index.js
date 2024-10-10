// Close button
const closeButton = document.getElementById('close-btn');
closeButton.addEventListener('click', () => {
    ipcRenderer.send('action:close');
});

// Loader hide/unhide
const loaderContainer = document.querySelector('.loader-container');
const loaderDescription = document.querySelector('.loader-description');
function showLoading(msg = '') {
    loaderContainer.style.display = 'flex';
    loaderDescription.textContent = msg;
    loaderDescription.style.display = 'block';
}

function hideLoading() {
    loaderContainer.style.display = 'none';
    loaderDescription.style.display = 'none';
}

// Switching between login/register
const logoOrange = document.querySelector('.logo-orange');
const logoBlue = document.querySelector('.logo-blue');
const modeContainer = document.querySelector('.mode-container')
const backgroundSlider = document.querySelector('.background-slider');
const loginContainer = document.querySelector('.login-container');
const registerContainer = document.querySelector('.register-container');
const blueGradient = document.querySelector('.blue-gradient');
const orangeGradient = document.querySelector('.orange-gradient');
const omenImg = document.querySelector('.omen-img');
const razeImg = document.querySelector('.raze-img');

function switchToLogin() {
    modeContainer.style.border = '1px solid #F4552B';
    backgroundSlider.style.transform = 'translateX(0)';
    backgroundSlider.style.backgroundColor = '#F4552B'
    backgroundSlider.style.borderRadius = '10px 0 0 10px'

    logoBlue.style.display = 'none';
    blueGradient.style.display = 'none';
    registerContainer.style.display = 'none';
    omenImg.style.display = 'none';
    document.querySelectorAll('input').forEach((inputField) => {
        inputField.style.borderBottom = 'none';
        inputField.value = '';
    });

    logoOrange.style.display = 'block';
    orangeGradient.style.display = 'block'
    loginContainer.style.display = 'block';
    razeImg.style.display = 'block';
}

function switchToRegister() {
    modeContainer.style.border = '1px solid #452FD2';
    backgroundSlider.style.transform = 'translateX(100%)';
    backgroundSlider.style.backgroundColor = '#4232B6'
    backgroundSlider.style.borderRadius = '0 10px 10px 0'

    logoOrange.style.display = 'none';
    orangeGradient.style.display = 'none'
    loginContainer.style.display = 'none';
    razeImg.style.display = 'none';
    document.querySelectorAll('input').forEach((inputField) => {
        inputField.style.borderBottom = 'none';
        inputField.value = '';
    });

    logoBlue.style.display = 'block';
    blueGradient.style.display = 'block';
    registerContainer.style.display = 'block';
    omenImg.style.display = 'block';
}

const loginSwitch = document.getElementById('loginSwitch');
loginSwitch.addEventListener('click', () => {
    switchToLogin();
});

const registerSwitch = document.getElementById('registerSwitch');
registerSwitch.addEventListener('click', () => {
    switchToRegister();
});

const registerSuggestion = document.querySelector('.goto-register');
registerSuggestion.addEventListener('click', switchToRegister);

const loginSuggestion = document.querySelector('.goto-login');
loginSuggestion.addEventListener('click', switchToLogin);

// Password (un)hide
function showPass(eyeOff, eyeOn, passwordInput) {
    eyeOff.style.display = 'none';
    eyeOn.style.display = 'block'
    passwordInput.type = 'text';
}

function hidePass(eyeOff, eyeOn, passwordInput) {
    eyeOff.style.display = 'block';
    eyeOn.style.display = 'none'
    passwordInput.type = 'password';
}

const eyeOffReg = document.querySelector('.eye-off-register');
const eyeOnReg = document.querySelector('.eye-on-register');
const passwordInputReg = document.getElementById('password-input-register');
eyeOffReg.addEventListener('click', () => {
    showPass(eyeOffReg, eyeOnReg, passwordInputReg);
});

eyeOnReg.addEventListener('click', () => {
    hidePass(eyeOffReg, eyeOnReg, passwordInputReg);
});

const eyeOffLog = document.querySelector('.eye-off-login');
const eyeOnLog = document.querySelector('.eye-on-login');
const passwordInputLog = document.getElementById('password-input-login');
eyeOffLog.addEventListener('click', () => {
    showPass(eyeOffLog, eyeOnLog, passwordInputLog);
});

eyeOnLog.addEventListener('click', () => {
    hidePass(eyeOffLog, eyeOnLog, passwordInputLog);
});

// Verifying user input (Login)
function displayError(errorText, inputField) {
    Toastify({
        text: `<svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7612 9.99893L19.6305 2.14129C19.8657 1.90606 19.9979 1.58701 19.9979 1.25434C19.9979 0.921668 19.8657 0.602622 19.6305 0.367388C19.3953 0.132153 19.0763 0 18.7437 0C18.411 0 18.092 0.132153 17.8568 0.367388L10 8.23752L2.14319 0.367388C1.90799 0.132153 1.58897 2.95361e-07 1.25634 2.97839e-07C0.923701 3.00318e-07 0.604689 0.132153 0.36948 0.367388C0.134271 0.602622 0.00213201 0.921668 0.002132 1.25434C0.002132 1.58701 0.134271 1.90606 0.36948 2.14129L8.23878 9.99893L0.36948 17.8566C0.252404 17.9727 0.159479 18.1109 0.0960643 18.2631C0.0326494 18.4153 0 18.5786 0 18.7435C0 18.9084 0.0326494 19.0717 0.0960643 19.224C0.159479 19.3762 0.252404 19.5143 0.36948 19.6305C0.4856 19.7476 0.623751 19.8405 0.775965 19.9039C0.928178 19.9673 1.09144 20 1.25634 20C1.42123 20 1.5845 19.9673 1.73671 19.9039C1.88892 19.8405 2.02708 19.7476 2.14319 19.6305L10 11.7603L17.8568 19.6305C17.9729 19.7476 18.1111 19.8405 18.2633 19.9039C18.4155 19.9673 18.5788 20 18.7437 20C18.9086 20 19.0718 19.9673 19.224 19.9039C19.3763 19.8405 19.5144 19.7476 19.6305 19.6305C19.7476 19.5143 19.8405 19.3762 19.9039 19.224C19.9674 19.0717 20 18.9084 20 18.7435C20 18.5786 19.9674 18.4153 19.9039 18.2631C19.8405 18.1109 19.7476 17.9727 19.6305 17.8566L11.7612 9.99893Z" fill="red"/>
            </svg>&nbsp;&nbsp;${errorText}`,
        duration: 3000,
        gravity: "top",
        position: "center",
        className: 'popup-error',
        escapeMarkup: false,
        stopOnFocus: false,
        close: false,
    }).showToast();

    document.querySelectorAll('input').forEach((otherInputField) => {
        otherInputField.style.borderBottom = 'none';
    });
    
    if (inputField) {
        inputField.style.borderBottom = '1px solid red';
    }
}

function login() {
    const usernameInput = document.getElementById('username-input-login');
    const passwordInput = document.getElementById('password-input-login');

    if (usernameInput.value === '') {
        usernameInput.style.borderBottom = '1px solid red';
        return;
    } 

    if (passwordInput.value === '') {
        usernameInput.style.borderBottom = 'none';
        passwordInput.style.borderBottom = '1px solid red';
        return;
    }

    showLoading('Verifying user details');
    auth.loginUser(usernameInput.value, passwordInput.value)
    .then(status => {
        switch (status) {
            case 200:
                ipcRenderer.send('goto:mainMenu')
                break;
            case 404:
                displayError('Username does not exist', usernameInput)
                break;
            case 401:
                displayError('Password is incorect', passwordInput)
                break;
            default:
                displayError('Something went wrong')
                break;
        }
        hideLoading();
    });
}

const loginButton = document.getElementById('login-btn');
loginButton.addEventListener('click', login);

// Verifying user input (Register)
function register() {
    const emailInput = document.getElementById('email-input-register');
    const usernameInput = document.getElementById('username-input-register');
    const passwordInput = document.getElementById('password-input-register');

    if (emailInput.value === '') {
        emailInput.style.borderBottom = '1px solid red';
        return;
    } 

    if (usernameInput.value === '') {
        emailInput.style.borderBottom = 'none';
        usernameInput.style.borderBottom = '1px solid red';
        return;
    } 

    if (passwordInput.value === '') {
        usernameInput.style.borderBottom = 'none';
        passwordInput.style.borderBottom = '1px solid red';
        return;
    }

    // Email verification
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value)) {
        displayError('Invalid email address', emailInput);
        return;
    }

    // Username pattern verification
    const usernameMin = 4;
    const usernameMax = 30;
    if (usernameMin > usernameInput.value.length || usernameInput.value.length > usernameMax) {
        displayError(`Username must contain ${usernameMin} - ${usernameMax} characters`, usernameInput);
        return;
    }
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(usernameInput.value)) {
        displayError('Username contains illegal characters', usernameInput);
        return;
    }

    // Password pattern verification
    const passwordMin = 6;
    const passwordMax = 30;
    if (passwordMin > passwordInput.value.length || passwordInput.value.length > passwordMax) {
        displayError(`Password must contain ${passwordMin} - ${passwordMax} characters`, passwordInput);
        return;
    }

    showLoading('Verifying user details');
    auth.registerUser(usernameInput.value, emailInput.value, passwordInput.value)
    .then(status => {
        switch (status) {
            case 200:
                ipcRenderer.send('goto:mainMenu');
                break;
            case 403:
                displayError('Username already exists', usernameInput);
                break;
            default:
                displayError('Something went wrong');
                break;
        }
        hideLoading();
    });
}

const registerButton = document.getElementById('register-btn');
registerButton.addEventListener('click', register);

// Post login window creation
document.addEventListener('DOMContentLoaded', () => {
    showLoading('Loading some useful stuff.. (May take some time)');
    ipcRenderer.on('firebase-initialized', () => {
        hideLoading();
    });
})