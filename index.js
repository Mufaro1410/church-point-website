// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Login Modal Functionality
const signinBtn = document.getElementById('signin-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');

signinBtn.addEventListener('click', (e) => {
    // e.preventDefault();
    // loginModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Pricing tiers
const pricingTiers = [
    { members: 75, price: 20 },
    { members: 150, price: 30 },
    { members: 250, price: 40 },
    { members: 350, price: 50 },
    { members: 500, price: 60 },
    { members: 750, price: 75 },
    { members: 1000, price: 90, label: "750+" }
];

function findTierIndex(memberCount) {
    return pricingTiers.findIndex(tier => memberCount <= tier.members);
}

function createPricingCard(tier, isCurrent = false) {
    const label = tier.label || `Up to ${tier.members}`;
    const features = [
        `${label} members`,
        'Member Management',
        'Event Calendar',
        'Donation Tracking',
        'Communication Tools',
        'Analytics & Reports'
    ];
    
    return `
        <div class="pricing-card ${isCurrent ? 'current' : ''}">
            <h3>${label}</h3>
            <div class="price">$${tier.price}<span>/month</span></div>
            <p>${isCurrent ? 'Recommended for your size' : tier.label === '750+' ? 'Enterprise solution' : 'For growing churches'}</p>
            <ul class="pricing-features">
                ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="#" class="btn ${isCurrent ? '' : 'btn-outline'}">Get Started</a>
        </div>
    `;
}

function updatePricingCards(tierIndex) {
    const pricingContainer = document.getElementById('pricing-cards');
    
    // Get previous, current, and next tiers
    const prevIndex = tierIndex > 0 ? tierIndex - 1 : null;
    const nextIndex = tierIndex < pricingTiers.length - 1 ? tierIndex + 1 : null;
    
    let html = '';
    
    // Previous tier
    if (prevIndex !== null) {
        html += createPricingCard(pricingTiers[prevIndex], false);
    }
    
    // Current tier
    html += createPricingCard(pricingTiers[tierIndex], true);
    
    // Next tier
    if (nextIndex !== null) {
        html += createPricingCard(pricingTiers[nextIndex], false);
    }
    
    pricingContainer.innerHTML = html;
}

// Initialize pricing
const memberCountSlider = document.getElementById('member-count');
const memberValueDisplay = document.getElementById('member-value');

// Set slider attributes to match tier count
memberCountSlider.min = 0;
memberCountSlider.max = pricingTiers.length - 1;
memberCountSlider.value = 2; // Start at 250 members (index 2)
memberCountSlider.step = 1;

function updateSlider(index) {
    const tier = pricingTiers[index];
    const displayValue = tier.label || tier.members;
    memberValueDisplay.textContent = displayValue;
    
    // Update slider background gradient
    const percentage = (index / (pricingTiers.length - 1)) * 100;
    memberCountSlider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    
    updatePricingCards(index);
}

memberCountSlider.addEventListener('input', (e) => {
    const index = parseInt(e.target.value);
    updateSlider(index);
});

// Initial load
updateSlider(2); // 250 members