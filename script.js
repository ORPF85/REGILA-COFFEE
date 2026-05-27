// ========================================== //
// 1. NAVIGATION HAMBURGER LOGIC              //
// ========================================== //
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ========================================== //
// 2. GLOBAL CART STATE ARRAY                 //
// ========================================== //
let cart = [];

// ========================================== //
// 3. CORE ADD TO CART INTERACTION LOGIC       //
// ========================================== //
function addToCart(button) {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    
    // 1. Turn button into Interactive Dark Brown & Change Text
    button.classList.add('added');
    const originalText = button.innerText;
    button.innerText = "✓ Added";
    
    // 2. Trigger Flying Bubble Animation toward floating cart icon
    animateToCart(button);
    
    // 3. Update or insert item into memory array
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    // 4. Redraw the UI Window elements
    updateCartUI();
    
    // 5. Safely reset button state back to original after 1.5 seconds
    setTimeout(() => {
        button.classList.remove('added');
        button.innerText = originalText;
    }, 1500);
}

// ========================================== //
// 4. FLYING BUBBLE ANIMATION SYSTEM          //
// ========================================== //
function animateToCart(button) {
    const cartIcon = document.getElementById('floating-cart');
    if (!cartIcon) return; // Guard clause if icon is missing

    const btnRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Create temporary flying dot overlay element
    const flyer = document.createElement('div');
    flyer.classList.add('flying-item');
    flyer.style.top = `${window.scrollY + btnRect.top + btnRect.height / 2}px`;
    flyer.style.left = `${window.scrollX + btnRect.left + btnRect.width / 2}px`;
    document.body.appendChild(flyer);
    
    // Force transition path frame updates
    setTimeout(() => {
        flyer.style.top = `${window.scrollY + cartRect.top + cartRect.height / 2}px`;
        flyer.style.left = `${window.scrollX + cartRect.left + cartRect.width / 2}px`;
        flyer.style.transform = 'scale(0.2)';
        flyer.style.opacity = '0';
    }, 50);
    
    // Auto-destruct node upon arrival
    setTimeout(() => { flyer.remove(); }, 850);
}

// ========================================== //
// 5. REALTIME POPUP WINDOW RENDERING ENGINE  //
// ========================================== //
function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const container = document.getElementById('cart-items-container');
    
    // Update count displayed over floating icon badge
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.innerText = totalCount;
    
    if (!container) return;
    
    // Reset contents
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        if (totalEl) totalEl.innerText = "0.00";
        return;
    }
    
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += (item.price * item.quantity);
        
        const row = document.createElement('div');
        row.classList.add('cart-item-row');
        row.innerHTML = `
            <span><strong>${item.name}</strong> (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        container.appendChild(row);
    });
    
    if (totalEl) totalEl.innerText = totalPrice.toFixed(2);
}

// ========================================== //
// 6. UI ACTIONS - OPEN / CLOSE MODAL WINDOW  //
// ========================================== //
function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    }
}

// ========================================== //
// 7. CHECKOUT & PAYMENT SELECTION FUNCTION   //
// ========================================== //
function processCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some coffee first.");
        return;
    }
    
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    const totalAmount = document.getElementById('cart-total').innerText;
    
    if (selectedMethod === 'cod') {
        alert(`🎉 Order Placed Successfully via Cash on Delivery!\nTotal Amount to pay on arrival: $${totalAmount}`);
        resetCart();
    } else {
        alert(`💳 Redirecting to Online Payment Gateway for $${totalAmount}...\n(In production, integration APIs like Stripe/PayPal load here!)`);
        resetCart();
    }
}

// Clear memory data completely
function resetCart() {
    cart = [];
    updateCartUI();
    toggleCartModal();
}
