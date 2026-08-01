/* ============================================
   কুন্দন শৈলী - Premium E-commerce JavaScript
   ============================================ */

// ============================================
// DATA STORE
// ============================================
const products = [
    { id: 1, name: "Premium Red Glass Bangles", category: "bridal", price: 850, originalPrice: 1200, rating: 5, reviews: 128, badge: "sale", image: "🔴", colors: ["Red", "Maroon"], sizes: ["2.4", "2.6", "2.8"], description: "Handcrafted premium red glass bangles with intricate gold detailing. Perfect for bridal wear and special occasions." },
    { id: 2, name: "Royal Blue Churi Set", category: "premium", price: 650, originalPrice: 850, rating: 4, reviews: 96, badge: "sale", image: "🔵", colors: ["Blue", "Navy"], sizes: ["2.4", "2.6", "2.8", "2.10"], description: "Elegant royal blue glass bangles set with traditional Bengali craftsmanship." },
    { id: 3, name: "Golden Festival Collection", category: "festival", price: 1200, originalPrice: 1500, rating: 5, reviews: 215, badge: "new", image: "🟡", colors: ["Gold", "Yellow"], sizes: ["2.6", "2.8"], description: "Exclusive golden bangles collection for festivals and celebrations." },
    { id: 4, name: "Pink Daily Wear Bangles", category: "daily", price: 350, originalPrice: 450, rating: 4, reviews: 342, badge: "", image: "🩷", colors: ["Pink", "Peach"], sizes: ["2.2", "2.4", "2.6"], description: "Lightweight pink glass bangles perfect for daily wear. Comfortable and stylish." },
    { id: 5, name: "Green Emerald Bridal Set", category: "bridal", price: 1500, originalPrice: 2000, rating: 5, reviews: 89, badge: "sale", image: "🟢", colors: ["Green", "Emerald"], sizes: ["2.4", "2.6", "2.8"], description: "Luxurious emerald green bridal bangles with stone work." },
    { id: 6, name: "Kids Rainbow Bangles", category: "kids", price: 250, originalPrice: 350, rating: 4, reviews: 156, badge: "new", image: "🌈", colors: ["Multi"], sizes: ["1.8", "2.0", "2.2"], description: "Colorful rainbow bangles set for kids. Safe and durable." },
    { id: 7, name: "White Pearl Churi", category: "premium", price: 950, originalPrice: 1200, rating: 5, reviews: 178, badge: "", image: "⚪", colors: ["White", "Cream"], sizes: ["2.4", "2.6", "2.8"], description: "Elegant white pearl-finish glass bangles for sophisticated look." },
    { id: 8, name: "Purple Velvet Bangles", category: "festival", price: 750, originalPrice: 950, rating: 4, reviews: 134, badge: "sale", image: "🟣", colors: ["Purple", "Violet"], sizes: ["2.4", "2.6", "2.8", "2.10"], description: "Rich purple velvet-textured glass bangles for festive occasions." },
    { id: 9, name: "Orange Marigold Set", category: "daily", price: 450, originalPrice: 550, rating: 4, reviews: 267, badge: "", image: "🟠", colors: ["Orange", "Coral"], sizes: ["2.4", "2.6"], description: "Vibrant orange bangles inspired by marigold flowers." },
    { id: 10, name: "Black Diamond Churi", category: "premium", price: 1100, originalPrice: 1400, rating: 5, reviews: 98, badge: "new", image: "⚫", colors: ["Black", "Silver"], sizes: ["2.4", "2.6", "2.8"], description: "Stunning black glass bangles with diamond-like sparkle." },
    { id: 11, name: "Silver Bridal Collection", category: "bridal", price: 1800, originalPrice: 2200, rating: 5, reviews: 76, badge: "sale", image: "⬜", colors: ["Silver", "White"], sizes: ["2.4", "2.6", "2.8"], description: "Premium silver bridal bangles with mirror work." },
    { id: 12, name: "Multicolor Festival Pack", category: "festival", price: 550, originalPrice: 700, rating: 4, reviews: 289, badge: "", image: "🎨", colors: ["Multi"], sizes: ["2.4", "2.6", "2.8"], description: "Set of 12 multicolor bangles for all festivals." }
];

const categories = [
    { id: "bridal", name: "Bridal", icon: "💎", count: 45 },
    { id: "premium", name: "Premium", icon: "👑", count: 32 },
    { id: "festival", name: "Festival", icon: "🎉", count: 58 },
    { id: "daily", name: "Daily Wear", icon: "✨", count: 76 },
    { id: "kids", name: "Kids", icon: "🧸", count: 24 }
];

const reviews = [
    { id: 1, name: "Rina Das", location: "Dhaka", rating: 5, text: "Absolutely stunning bangles! The quality is exceptional and the colors are so vibrant. Perfect for my sister's wedding!", avatar: "👩" },
    { id: 2, name: "Priya Saha", location: "Chittagong", rating: 5, text: "Best glass bangles I've ever purchased. The craftsmanship is beautiful and they arrived perfectly packaged.", avatar: "👩‍🦱" },
    { id: 3, name: "Anika Rahman", location: "Sylhet", rating: 4, text: "Love the variety and the prices are reasonable. Fast delivery and excellent customer service.", avatar: "👩‍🦰" }
];

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
const Storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    },
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('user')
};

// ============================================
// CART FUNCTIONS
// ============================================
const Cart = {
    get: () => Storage.get('cart'),
    add: (product, quantity = 1, color = null, size = null) => {
        const cart = Cart.get();
        const existing = cart.find(item => item.id === product.id && item.color === color && item.size === size);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity, color, size, cartId: Date.now() });
        }
        Storage.set('cart', cart);
        Cart.updateUI();
        Toast.show('Added to cart!', 'success');
    },
    remove: (cartId) => {
        let cart = Cart.get();
        cart = cart.filter(item => item.cartId !== cartId);
        Storage.set('cart', cart);
        Cart.updateUI();
        Toast.show('Removed from cart', 'info');
    },
    updateQuantity: (cartId, quantity) => {
        const cart = Cart.get();
        const item = cart.find(i => i.cartId === cartId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            Storage.set('cart', cart);
            Cart.updateUI();
        }
    },
    clear: () => {
        Storage.set('cart', []);
        Cart.updateUI();
    },
    getCount: () => Cart.get().reduce((sum, item) => sum + item.quantity, 0),
    getTotal: () => Cart.get().reduce((sum, item) => sum + (item.price * item.quantity), 0),
    updateUI: () => {
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(badge => badge.textContent = Cart.getCount());
    }
};

// ============================================
// WISHLIST FUNCTIONS
// ============================================
const Wishlist = {
    get: () => Storage.get('wishlist'),
    toggle: (product) => {
        const wishlist = Wishlist.get();
        const index = wishlist.findIndex(item => item.id === product.id);
        if (index > -1) {
            wishlist.splice(index, 1);
            Storage.set('wishlist', wishlist);
            Toast.show('Removed from wishlist', 'info');
            return false;
        } else {
            wishlist.push(product);
            Storage.set('wishlist', wishlist);
            Toast.show('Added to wishlist!', 'success');
            return true;
        }
    },
    isInWishlist: (productId) => Wishlist.get().some(item => item.id === productId),
    getCount: () => Wishlist.get().length,
    updateUI: () => {
        const badges = document.querySelectorAll('.wishlist-count');
        badges.forEach(badge => badge.textContent = Wishlist.getCount());
    }
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================
const Toast = {
    show: (message, type = 'info') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        toast.innerHTML = `<i>${icon}</i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
};

// ============================================
// AUTH FUNCTIONS
// ============================================
const Auth = {
    register: (name, email, phone, password) => {
        const users = Storage.get('users');
        if (users.find(u => u.email === email)) {
            Toast.show('Email already registered!', 'error');
            return false;
        }
        users.push({ id: Date.now(), name, email, phone, password, createdAt: new Date().toISOString() });
        Storage.set('users', users);
        Toast.show('Registration successful! Please login.', 'success');
        return true;
    },
    login: (email, password) => {
        const users = Storage.get('users');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            Storage.setUser({ id: user.id, name: user.name, email: user.email, phone: user.phone });
            Toast.show(`Welcome back, ${user.name}!`, 'success');
            return true;
        }
        Toast.show('Invalid email or password!', 'error');
        return false;
    },
    logout: () => {
        Storage.removeUser();
        Toast.show('Logged out successfully!', 'info');
        setTimeout(() => window.location.href = 'index.html', 1000);
    },
    isLoggedIn: () => !!Storage.getUser(),
    getUser: () => Storage.getUser()
};

// ============================================
// ORDER FUNCTIONS
// ============================================
const Order = {
    get: () => Storage.get('orders'),
    place: (orderData) => {
        const orders = Order.get();
        const order = {
            id: 'KS' + Date.now().toString().slice(-8),
            ...orderData,
            status: 'pending',
            date: new Date().toISOString(),
            timeline: [
                { status: 'Order Placed', description: 'Your order has been placed successfully', time: new Date().toLocaleString(), completed: true },
                { status: 'Processing', description: 'Order is being processed', time: '', completed: false },
                { status: 'Shipped', description: 'Order has been shipped', time: '', completed: false },
                { status: 'Delivered', description: 'Order delivered successfully', time: '', completed: false }
            ]
        };
        orders.push(order);
        Storage.set('orders', orders);
        Cart.clear();
        return order;
    },
    getById: (orderId) => Order.get().find(o => o.id === orderId)
};

// ============================================
// COUPON FUNCTIONS
// ============================================
const Coupon = {
    valid: { 'KUNDAN10': 10, 'GOLD20': 20, 'BRIDAL15': 15, 'WELCOME5': 5 },
    apply: (code, total) => {
        const discount = Coupon.valid[code.toUpperCase()];
        if (discount) {
            return { valid: true, discount, newTotal: Math.round(total * (1 - discount / 100)) };
        }
        return { valid: false, discount: 0, newTotal: total };
    }
};

// ============================================
// RENDER FUNCTIONS
// ============================================
const Render = {
    stars: (rating) => {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += i <= rating ? '★' : '☆';
        }
        return html;
    },
    productCard: (product) => {
        const inWishlist = Wishlist.isInWishlist(product.id);
        return `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
            <div class="product-image">
                <div style="font-size: 5rem; display: flex; align-items: center; justify-content: center; height: 100%;">${product.image}</div>
                <div class="product-actions">
                    <button class="product-action-btn wishlist-btn" data-id="${product.id}" title="${inWishlist ? 'Remove from' : 'Add to'} Wishlist">
                        ${inWishlist ? '❤️' : '🤍'}
                    </button>
                    <button class="product-action-btn quick-view-btn" data-id="${product.id}" title="Quick View">👁</button>
                    <button class="product-action-btn add-cart-btn" data-id="${product.id}" title="Add to Cart">🛒</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">${Render.stars(product.rating)} <span style="color: var(--gray); font-size: 0.8rem;">(${product.reviews})</span></div>
                <div class="product-price">
                    <span class="current">৳${product.price}</span>
                    ${product.originalPrice > product.price ? `<span class="original">৳${product.originalPrice}</span>` : ''}
                </div>
            </div>
        </div>`;
    },
    products: (container, productList) => {
        if (!container) return;
        container.innerHTML = productList.map(p => Render.productCard(p)).join('');
        attachProductListeners();
    }
};

// ============================================
// EVENT LISTENERS
// ============================================
function attachProductListeners() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id == btn.dataset.id);
            const added = Wishlist.toggle(product);
            btn.innerHTML = added ? '❤️' : '🤍';
            btn.title = added ? 'Remove from Wishlist' : 'Add to Wishlist';
            Wishlist.updateUI();
        });
    });

    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id == btn.dataset.id);
            Cart.add(product);
        });
    });

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id == btn.dataset.id);
            showQuickView(product);
        });
    });
}

function showQuickView(product) {
    let modal = document.querySelector('.modal-overlay');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <div class="product-detail" style="grid-template-columns: 1fr 1fr; gap: 40px;">
                <div class="main-image" style="margin-bottom: 0;">
                    <div style="font-size: 8rem;">${product.image}</div>
                </div>
                <div>
                    <h1 style="font-size: 1.5rem;">${product.name}</h1>
                    <div class="product-rating" style="margin: 10px 0;">${Render.stars(product.rating)} (${product.reviews} reviews)</div>
                    <div class="product-price-detail" style="padding: 15px 0; margin-bottom: 20px;">
                        <span class="current">৳${product.price}</span>
                        ${product.originalPrice > product.price ? `<span class="original">৳${product.originalPrice}</span>` : ''}
                    </div>
                    <p style="color: var(--gray); margin-bottom: 20px; line-height: 1.7;">${product.description}</p>
                    <div class="product-actions-detail" style="margin-bottom: 0;">
                        <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                            <span>🛒</span> Add to Cart
                        </button>
                        <button class="btn btn-outline wishlist-modal" data-id="${product.id}">
                            <span>${Wishlist.isInWishlist(product.id) ? '❤️' : '🤍'}</span> Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');

    modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        Cart.add(product);
        modal.classList.remove('active');
    });

    modal.querySelector('.wishlist-modal').addEventListener('click', function() {
        const added = Wishlist.toggle(product);
        this.innerHTML = `<span>${added ? '❤️' : '🤍'}</span> Wishlist`;
        Wishlist.updateUI();
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeader() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-menu');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('active'));
    }
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (btn) {
        window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500));
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
    const countdown = document.querySelector('.countdown');
    if (!countdown) return;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    function update() {
        const now = new Date();
        const diff = endDate - now;
        if (diff <= 0) return;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const items = countdown.querySelectorAll('.countdown-item');
        if (items[0]) items[0].querySelector('.number').textContent = String(days).padStart(2, '0');
        if (items[1]) items[1].querySelector('.number').textContent = String(hours).padStart(2, '0');
        if (items[2]) items[2].querySelector('.number').textContent = String(minutes).padStart(2, '0');
        if (items[3]) items[3].querySelector('.number').textContent = String(seconds).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

// ============================================
// UPDATE AUTH UI
// ============================================
function updateAuthUI() {
    const user = Auth.getUser();
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        if (user) {
            link.innerHTML = `<span>👤</span> ${user.name.split(' ')[0]}`;
            link.href = 'account.html';
        } else {
            link.innerHTML = `<span>👤</span> Login`;
            link.href = 'login.html';
        }
    });
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateUI();
    Wishlist.updateUI();
    initHeader();
    initMobileMenu();
    initScrollTop();
    initCountdown();
    updateAuthUI();
});
