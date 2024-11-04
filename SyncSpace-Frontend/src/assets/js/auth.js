// auth.js

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        const userName = email.split('@')[0]; // Example username logic
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userName', userName);
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all the fields!');
    }
}

function signupUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (name && email && password) {
        window.location.href = 'index.html'; // Redirect on successful signup
    } else {
        alert('Please fill in all fields.');
    }
}

// Attach the event listeners
document.getElementById('loginForm')?.addEventListener('submit', loginUser);
document.getElementById('signupForm')?.addEventListener('submit', signupUser);
