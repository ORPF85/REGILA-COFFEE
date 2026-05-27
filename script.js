// Toggle Hamburger Menu for Mobile Responsiveness
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Click Payment Button Action Handler
document.querySelectorAll('.pay-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        const name = menuItem.getAttribute('data-name');
        const price = menuItem.getAttribute('data-price');

        alert(`Opening instant checkout for 1x ${name} ($${price})...`);

        // Replace "your_paypal_username" with your actual PayPal email or username
        window.location.href = `https://www.paypal.com/paypalme/your_paypal_username/${price}`;
    });
});
