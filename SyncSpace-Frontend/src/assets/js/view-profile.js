document.addEventListener('DOMContentLoaded', () => {
    // Load user data from localStorage or set defaults
    const username = localStorage.getItem('userName') || 'YourUsername';
    const email = localStorage.getItem('email') || 'youremail@example.com';
    const bio = localStorage.getItem('bio') || '';
  
    // Populate the fields with existing data
    document.getElementById('username').value = username;
    document.getElementById('email').value = email;
    document.getElementById('bio').value = bio;

    // Handle profile photo upload
    document.getElementById('profilePhoto').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.getElementById('photoPreview');
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // Save changes on form submit
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Update localStorage with new values
        const updatedUsername = document.getElementById('username').value;
        const updatedEmail = document.getElementById('email').value;
        const updatedBio = document.getElementById('bio').value;

        localStorage.setItem('userName', updatedUsername);
        localStorage.setItem('email', updatedEmail);
        localStorage.setItem('bio', updatedBio);

        alert('Profile updated successfully!');
    });
});
