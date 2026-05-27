document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ELONGATE ABOUT US WITH A BEAUTIFUL STORY
    // ==========================================
    const aboutContent = document.querySelector(".about-content");
    if (aboutContent) {
        aboutContent.innerHTML = `
            <h2>Our Story: Sourced by Passion, Roasted by Art</h2>
            <p>It all began in the winter of 2018 in a small kitchen corner with nothing but an old popcorn popper, a handful of green coffee beans, and a dream to find the perfect morning cup. What started as an obsession with flavor profiles quickly turned into a mission to bring people together over genuinely remarkable coffee.</p>
            <p>We traveled across mountains to partner directly with single-origin family farms, ensuring our beans are sustainably harvested and ethically traded. Today, our master roasters listen to the distinct 'first crack' of the beans daily, unlocking rich notes of caramelized chocolate, bright citrus, and velvety hazelnut. Every pour, every grind, and every cup we serve is a chapter of that ongoing story—crafted thoughtfully for your senses.</p>
            <a href="#menu" class="btn">Explore Our Creations</a>
        `;
    }

    // ==========================================
    // 2. INJECT CART OVERLAY PANEL & FORM INTO HTML
    // ==========================================
    const cartOverlay = document.createElement("div");
    cartOverlay.id = "custom-cart-panel";
    cartOverlay.innerHTML = `
        <div class="cart-panel-content">
            <span class="close-panel-btn">&times;</span>
            <h2>Your Order Details</h2>
            <div id="panel-items-list"></div>
            <div class="panel-total-row"><strong>Total Amount:</strong> <span id="panel-total-price">₹0</span></div>
            
            <form id="checkout-details-form">
                <h3>Delivery Information</h3>
                <input type="text" id="cust-name" placeholder="Full Name" required>
                <input type="tel" id="cust-phone" placeholder="Phone Number" required>
                <input type="text" id="cust-address" placeholder="Delivery Address" required>
                <input type="text" id="cust-landmark" placeholder="Nearby Landmark (e.g., Near City Hospital)" required>
                
                <h3>Payment Method</h3>
                <div class="pay-options">
                    <label><input type="radio" name="pay-method" value="Online Payment" checked> Online Payment (Card/UPI)</label>
                    <label><input type="radio" name="pay-method" value="Cash on Delivery"> Cash on Delivery (COD)</label>
                </div>
                <button type="submit" class="submit-order-btn">Place Order via WhatsApp</button>
            </form>
        </div>
    `;
    document.body.appendChild(cartOverlay);

    // ==========================================
    // 3. CART SYSTEM LOGIC & CUSTOMIZATION (Syncing with Original variables)
    // ==========================================
    let customCartItems = [];
    const originalFloatingCart = document.getElementById("floating-cart");

    if (originalFloatingCart) {
        originalFloatingCart.style.cursor = "pointer";
        originalFloatingCart.addEventListener("click", () => {
            cartOverlay.style.display = "flex";
            renderPanelCart();
        });
    }

    document.querySelector(".close-panel-btn").addEventListener("click", () => {
        cartOverlay.style.display = "none";
    });

    // Capture menu button clicks to build out detailed order quantities
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseInt(button.getAttribute("data-price"));
            
            const existing = customCartItems.find(item => item.name === name);
            if (existing) {
                existing.quantity++;
            } else {
                customCartItems.push({ name, price, quantity: 1 });
            }
            renderPanelCart();
        });
    });

    function renderPanelCart() {
        const container = document.getElementById("panel-items-list");
        const totalSpan = document.getElementById("panel-total-price");
        container.innerHTML = "";
        
        if (customCartItems.length === 0) {
            container.innerHTML = "<p style='color:#666;'>Your cart is empty.</p>";
            totalSpan.innerText = "₹0";
            return;
        }

        let currentTotal = 0;
        customCartItems.forEach((item, index) => {
            currentTotal += (item.price * item.quantity);
            const row = document.createElement("div");
            row.className = "panel-item-row";
            row.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color:#7c2d12;">₹${item.price} each</span>
                </div>
                <div class="item-qty-controls">
                    <button type="button" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="changeQty(${index}, 1)">+</button>
                </div>
            `;
            container.appendChild(row);
        });
        totalSpan.innerText = "₹" + currentTotal;
    }

    window.changeQty = (index, change) => {
        customCartItems[index].quantity += change;
        if (customCartItems[index].quantity <= 0) {
            customCartItems.splice(index, 1);
        }
        
        // Synchronize display total back to original header count circle
        let newTotalCount = customCartItems.reduce((acc, item) => acc + item.quantity, 0);
        const originalBadge = document.getElementById("cart-count");
        if (originalBadge) originalBadge.innerText = newTotalCount;
        totalCount = newTotalCount; 

        renderPanelCart();
    };

    // Checkout form handler -> Bundles values cleanly into WhatsApp text stream
    document.getElementById("checkout-details-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("cust-name").value;
        const phone = document.getElementById("cust-phone").value;
        const address = document.getElementById("cust-address").value;
        const landmark = document.getElementById("cust-landmark").value;
        const method = document.querySelector('input[name="pay-method"]:checked').value;
        const finalPrice = document.getElementById("panel-total-price").innerText;

        let message = `☕ *NEW CAFE ORDER* ☕\n\n`;
        message += `👤 *Customer Details:*\n`;
        message += `• Name: ${name}\n• Phone: ${phone}\n• Address: ${address}\n• Landmark: ${landmark}\n\n`;
        message += `🛒 *Items Ordered:*\n`;
        
        customCartItems.forEach(item => {
            message += `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
        });
        
        message += `\n💰 *Total Bill:* ${finalPrice}\n`;
        message += `💳 *Payment Mode:* ${method}`;

        window.open(`https://api.whatsapp.com/send?phone=919258856577&text=${encodeURIComponent(message)}`, '_blank');
        
        // Reset system safely
        customCartItems = [];
        document.getElementById("checkout-details-form").reset();
        const originalBadge = document.getElementById("cart-count");
        if (originalBadge) originalBadge.innerText = "0";
        totalCount = 0;
        cartOverlay.style.display = "none";
    });

    // ==========================================
    // 4. ZERO-3RD-PARTY DIRECT EMAIL REVIEW FORM
    // ==========================================
    const testimonialSection = document.getElementById("testimonials");
    if (testimonialSection) {
        const reviewBox = document.createElement("div");
        reviewBox.id = "custom-review-container";
        reviewBox.innerHTML = `
            <h3>Share Your Experience With Us</h3>
            <form id="native-review-form">
                <input type="text" id="rev-name" placeholder="Your Name" required>
                <select id="rev-rating">
                    <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="⭐⭐⭐⭐">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="⭐⭐⭐">⭐⭐⭐ (3 Stars)</option>
                    <option value="⭐⭐">⭐⭐ (2 Stars)</option>
                    <option value="⭐">⭐ (1 Star)</option>
                </select>
                <textarea id="rev-msg" rows="4" placeholder="Write your review here..." required></textarea>
                <button type="submit" class="btn">Send Email Review</button>
            </form>
        `;
        testimonialSection.appendChild(reviewBox);

        document.getElementById("native-review-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const rName = document.getElementById("rev-name").value;
            const rRating = document.getElementById("rev-rating").value;
            const rMsg = document.getElementById("rev-msg").value;

            const emailSubject = encodeURIComponent(`New Cafe Review From ${rName}`);
            const emailBody = encodeURIComponent(`Customer Name: ${rName}\nRating: ${rRating}\n\nReview Message:\n${rMsg}`);
            
            const mailerLink = document.getElementById("email-router");
            if (mailerLink) {
                // Dynamically build a local secure mail link to open user email app directly
                mailerLink.href = `mailto:dhruvagarwal643@gmail.com?subject=${emailSubject}&body=${emailBody}`;
                mailerLink.click();
                
                alert("Opening your default mail client to dispatch your feedback securely to our inbox!");
                document.getElementById("native-review-form").reset();
            }
        });
    }
});
