// Use the injected config from config.js
const SUPABASE_URL = window.SUPABASE_CONFIG.url;
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG.anonKey;

const resetForm = document.getElementById('reset-form');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
                email: email
            })
        });
        
        if (response.ok) {
            successMessage.style.display = 'flex';
            resetForm.reset();
        } else {
            const error = await response.json();
            errorText.textContent = error.msg || 'Failed to send reset link. Please try again.';
            errorMessage.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        errorText.textContent = 'Network error. Please check your connection.';
        errorMessage.style.display = 'flex';
    }
});