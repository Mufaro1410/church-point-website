// Use the injected config from config.js
const SUPABASE_URL = window.SUPABASE_CONFIG.url;
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG.anonKey;

const updatePasswordForm = document.getElementById('update-password-form');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const submitText = document.getElementById('submit-text');
const submitLoader = document.getElementById('submit-loader');

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// Get access token from URL hash
function getAccessTokenFromUrl() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get('access_token');
}

// Check if we have an access token
const accessToken = getAccessTokenFromUrl();

if (!accessToken) {
    errorText.textContent = 'Invalid or expired reset link. Please request a new one.';
    errorMessage.style.display = 'flex';
    updatePasswordForm.style.display = 'none';
}

updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
        errorText.textContent = 'Passwords do not match. Please try again.';
        errorMessage.style.display = 'flex';
        return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
        errorText.textContent = 'Password must be at least 6 characters long.';
        errorMessage.style.display = 'flex';
        return;
    }
    
    // Show loader
    submitText.style.display = 'none';
    submitLoader.style.display = 'inline-flex';
    
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                password: newPassword
            })
        });
        
        if (response.ok) {
            successMessage.style.display = 'flex';
            updatePasswordForm.reset();
            
            // Redirect to sign in page after 3 seconds
            setTimeout(() => {
                window.location.href = 'http://churchpointorg.s3-website.af-south-1.amazonaws.com';
            }, 3000);
        } else {
            const error = await response.json();
            errorText.textContent = error.msg || 'Failed to update password. Please try again.';
            errorMessage.style.display = 'flex';
            
            // Reset button state
            submitText.style.display = 'inline';
            submitLoader.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        errorText.textContent = 'Network error. Please check your connection.';
        errorMessage.style.display = 'flex';
        
        // Reset button state
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
});