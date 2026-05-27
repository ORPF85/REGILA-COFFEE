// Navigation Hamburger Logic
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// State Array Tracking Selected Menu Items
let cart = [];

// DOM Elements Linkage
const cartIconBtn = document.getElementById('cart-icon-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items-container');
const cartTotalAmount = document.querySelector('.cart-total-amount');
const cartCountBadge = document.querySelector('.cart-count');
const checkoutPaymentBtn = document.getElementById('checkout-payment-btn');

// Open / Close Cart UI Actions
cartIconBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
});

const closeCartInterface = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
};

closeCartBtn.addEventListener('click', closeCartInterface);
cartOverlay.addEventListener('click', closeCartInterface);

// Listen to Menu "Add to Cart" Buttons Click Events
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        const id = menuItem.getAttribute('data-id');
        const name = menuItem.getAttribute('data-name');
        const price = parseFloat(menuItem.getAttribute('data-price'));

        addItemToCartArray(id, name, price);
    });
});

// Add Item To Memory Array
function addItemToCartArray(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
}

// Drop Item From Memory Array
function removeItemFromCartArray(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Redraw UI Items and Totals Realtime
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name} (x${item.quantity})</h4>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item-btn" onclick="removeItemFromCartArray('${item.id}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalAmount.innerText = `$${total.toFixed(2)}`;
    cartCountBadge.innerText = count;
}

// Payment Redirection Execution Hook
checkoutPaymentBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Choose delicious items from the menu first.");
        return;
    }

    // Capture calculated total value
    const finalAmount = cartTotalAmount.innerText;

    alert(`Redirecting to payment portal to clear your invoice of ${finalAmount}...`);

    // HOW TO INTEGRATE DEPLOYED PAYMENT GATEWAYS IN NO-SERVER CLIENT ENVIRONMENTS:
    // Option A: Set up a Stripe Payment Link dashboard asset, then use:
    // window.location.href = "https://buy.stripe.com/your_custom_payment_link_id";
    
    // Option B: Redirect to a custom PayPal business profile invoicing URL:
    // window.location.href = `https://www.paypal.com/paypalme/yourbusinessname/${parseFloat(finalAmount.replace('$',''))}`;
});
// ========================================== //
// CART LOGIC & PAYMENT INTERACTION           //
// ========================================== //

let cart = [];

function addToCart(button) {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    
    // 1. Button Feedback Change
    button.classList.add('added');
    const originalText = button.innerText;
    button.innerText = "✓ Added";
    
    // 2. Trigger Flying Animation
    animateToCart(button);
    
    // 3. Update the data tracking
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    // 4. Update Cart display
    updateCartUI();
    
    // Reset individual button click look after 1.5 seconds
    setTimeout(() => {
        button.classList.remove('added');
        button.innerText = originalText;
    }, 1500);
}

function animateToCart(button) {
    const cartIcon = document.getElementById('floating-cart');
    const btnRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    const flyer = document.createElement('div');
    flyer.classList.add('flying-item');
    flyer.style.top = `${btnRect.top + btnRect.height/2}px`;
    flyer.style.left = `${btnRect.left + btnRect.width/2}px`;
    document.body.appendChild(flyer);
    
    setTimeout(() => {
        flyer.style.top = `${cartRect.top + cartRect.height/2}px`;
        flyer.style.left = `${cartRect.left + cartRect.width/2}px`;
        flyer.style.transform = 'scale(0.2)';
        flyer.style.opacity = '0';
    }, 50);
    
    setTimeout(() => { flyer.remove(); }, 850);
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const container = document.getElementById('cart-items-container');
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.innerText = totalCount;
    
    container.innerHTML = '';
    if(cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        totalEl.innerText = "0.00";
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
    
    totalEl.innerText = totalPrice.toFixed(2);
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function processCheckout() {
    if(cart.length === 0) {
        alert("Your cart is empty! Add some coffee first.");
        return;
    }
    
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    const totalAmount = document.getElementById('cart-total').innerText;
    
    if(selectedMethod === 'cod') {
        alert(`Order Placed Successfully via Cash on Delivery!\nTotal Amount to pay on arrival: $${totalAmount}`);
        resetCart();
    } else {
        alert(`Redirecting to Online Payment Gateway for $${totalAmount}...\n(Integrating APIs like Stripe or PayPal goes here in production!)`);
        resetCart();
    }
}

function resetCart() {
    cart = [];
    updateCartUI();
    toggleCartModal();
}
