// 1. HAMBURGER LOGIC
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger) {
    hamburger.addEventListener('click', () => { navMenu.classList.toggle('active'); });
}

// 2. STATE VARIABLE
let cart = [];

// 3. ADD TO CART TRIGGER
function addToCart(button) {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    
    button.classList.add('added');
    const originalText = button.innerText;
    button.innerText = "✓ Added";
    
    animateToCart(button);
    
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
    
    setTimeout(() => {
        button.classList.remove('added');
        button.innerText = originalText;
    }, 1500);
}

// 4. FLYING DOT BUBBLE ENGINE
function animateToCart(button) {
    const cartIcon = document.getElementById('floating-cart');
    if (!cartIcon) return;
    const btnRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    const flyer = document.createElement('div');
    flyer.classList.add('flying-item');
    flyer.style.top = `${window.scrollY + btnRect.top + btnRect.height / 2}px`;
    flyer.style.left = `${window.scrollX + btnRect.left + btnRect.width / 2}px`;
    document.body.appendChild(flyer);
    
    setTimeout(() => {
        flyer.style.top = `${window.scrollY + cartRect.top + cartRect.height / 2}px`;
        flyer.style.left = `${window.scrollX + cartRect.left + cartRect.width / 2}px`;
        flyer.style.transform = 'scale(0.2)';
        flyer.style.opacity = '0';
    }, 50);
    
    setTimeout(() => { flyer.remove(); }, 850);
}

// 5. UPDATE POPUP LOOKS
function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const container = document.getElementById('cart-items-container');
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.innerText = totalCount;
    if (!container) return;
    
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
        row.innerHTML = `<span><strong>${item.name}</strong> (x${item.quantity})</span><span>$${(item.price * item.quantity).toFixed(2)}</span>`;
        container.appendChild(row);
    });
    if (totalEl) totalEl.innerText = totalPrice.toFixed(2);
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// 6. ORDER WRITING & RECEIVING DISPATCH ENGINE (WhatsApp Setup)
function processCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    const totalAmount = document.getElementById('cart-total').innerText;
    
    // Build text message layout string automatically containing item summaries
    let orderText = `☕ *NEW CAFE ORDER RECIPIENT* ☕\n\n`;
    cart.forEach(item => {
        orderText += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderText += `\n💰 *Total Amount:* $${totalAmount}`;
    orderText += `\n💳 *Payment Method:* ${selectedMethod.toUpperCase()}`;
    
    // CONFIGURE: Replace this line with your own active phone country line string
    const shopOwnerPhone = "1234567890"; // <- Put your actual number here!
    
    alert(`Order captured! Opening dispatcher channel to forward request data directly to the owner via WhatsApp...`);
    
    // Encodes characters for clean URL passage and triggers deep linking redirect
    window.open(`https://api.whatsapp.com/send?phone=${shopOwnerPhone}&text=${encodeURIComponent(orderText)}`, '_blank');
    
    resetCart();
}

function resetCart() {
    cart = [];
    updateCartUI();
    toggleCartModal();
}

// 7. INTERACTIVE CUSTOMER REVIEWS FEEDBACK SYSTEM
function handleReviewSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('reviewerName').value;
    const ratingInput = parseInt(document.getElementById('reviewerRating').value);
    const textInput = document.getElementById('reviewerText').value;
    const reviewsList = document.getElementById('reviews-list');
    
    // Generate star font-awesome templates
    let starHTML = '';
    for (let i = 0; i < 5; i++) {
        starHTML += i < ratingInput ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    
    // Create element structure
    const newReviewCard = document.createElement('div');
    newReviewCard.classList.add('testimonial-card');
    newReviewCard.style.borderLeft = "4px solid var(--primary-color)";
    newReviewCard.style.animation = "fadeIn 0.5s ease-in-out";
    newReviewCard.innerHTML = `
        <div class="stars" style="color: #f59e0b; margin-bottom: 15px;">${starHTML}</div>
        <p>"${textInput}"</p>
        <h4>- ${nameInput} (Verified Customer)</h4>
    `;
    
    // Insert new card right at top of review grid container
    reviewsList.insertBefore(newReviewCard, reviewsList.firstChild);
    
    // Flash clear entries
    document.getElementById('reviewForm').reset();
    alert("Thank you! Your feedback score was saved and published live below.");
}
