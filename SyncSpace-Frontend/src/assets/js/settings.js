document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme');
    const switchAccountButton = document.getElementById('switchAccount');
    const deleteAccountButton = document.getElementById('deleteAccount');
    const notificationsCheckbox = document.getElementById('notifications');

    // Load and apply the selected theme
    const currentTheme = localStorage.getItem('theme') || 'default';
    themeSelect.value = currentTheme;
    applyTheme(currentTheme);

    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
    });

    switchAccountButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    deleteAccountButton.addEventListener('click', () => {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmation) {
            // Handle account deletion logic here (e.g., remove from localStorage)
            localStorage.clear();
            alert("Your account has been deleted.");
            window.location.href = 'login.html'; // Redirect to login after deletion
        }
    });

    notificationsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            alert("Notifications enabled!");
        } else {
            alert("Notifications disabled.");
        }
    });
});

// Function to apply the selected theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#fff';
    } else {
        document.body.style.backgroundColor = '#f4f4f4';
        document.body.style.color = '#333';
    }
}
