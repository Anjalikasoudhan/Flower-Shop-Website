// ================= UI TOGGLES =================
let searchForm = document.querySelector('.search-form');
let navbar = document.querySelector('.navbar');
let cartBox = document.querySelector('#cart-container');
let userBox = document.querySelector('#user-container');
let successBox = document.querySelector('#success-dialog');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    [navbar, cartBox, userBox].forEach(el => el.classList.remove('active'));
};

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    [searchForm, cartBox, userBox].forEach(el => el.classList.remove('active'));
};

document.querySelector('#cart-icon-btn').onclick = () => {
    cartBox.classList.toggle('active');
    [navbar, searchForm, userBox].forEach(el => el.classList.remove('active'));
};

document.querySelector('#user-icon-btn').onclick = () => {
    userBox.classList.toggle('active');
    [navbar, searchForm, cartBox].forEach(el => el.classList.remove('active'));
};

window.onscroll = () => {
    [searchForm, navbar, cartBox, userBox].forEach(el => el.classList.remove('active'));
};

// ================= SEARCH FUNCTIONALITY =================
const searchInput = document.getElementById("input-box");

searchInput.oninput = () => {
    let value = searchInput.value.toLowerCase().trim();
    let products = document.querySelectorAll(".product-item");

    products.forEach(product => {
        let name = product.getAttribute("data-name").toLowerCase();
        // If searching, hide non-matches. If empty, show all.
        if (name.indexOf(value) > -1) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
};

// ================= CART LOGIC =================
let cart = JSON.parse(localStorage.getItem("flower_cart")) || [];

function attachAddToCart() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            let name = btn.getAttribute("data-name");
            let price = parseFloat(btn.getAttribute("data-price"));
            cart.push({ name, price });
            localStorage.setItem("flower_cart", JSON.stringify(cart));
            updateCartUI();
        };
    });
}

function updateCartUI() {
    const cartList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        let li = document.createElement("li");
        li.innerHTML = `
            <span>${item.name} ($${item.price})</span>
            <button onclick="removeFromCart(${index})">X</button>
        `;
        cartList.appendChild(li);
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = cart.length;
}

window.removeFromCart = (i) => {
    cart.splice(i, 1);
    localStorage.setItem("flower_cart", JSON.stringify(cart));
    updateCartUI();
};

// ================= USER & ORDER LOGIC =================
window.saveUser = () => {
    let name = document.getElementById("u-name").value;
    let phone = document.getElementById("u-phone").value;
    let address = document.getElementById("u-address").value;

    localStorage.setItem("flower_user", JSON.stringify({ name, phone, address }));
    fillForms();
    userBox.classList.remove('active');
};

function fillForms() {
    let user = JSON.parse(localStorage.getItem("flower_user"));
    if (user) {
        document.getElementById("u-name").value = user.name || '';
        document.getElementById("form-name").value = user.name || '';
        document.getElementById("form-phone").value = user.phone || '';
        document.getElementById("form-address").value = user.address || '';
    }
}

document.getElementById('order-form').onsubmit = (e) => {
    e.preventDefault();
    successBox.classList.add('active');
    cart = [];
    localStorage.setItem("flower_cart", JSON.stringify(cart));
    updateCartUI();
};

window.closeSuccess = () => {
    successBox.classList.remove('active');
};

// ================= SWIPER INIT =================
var swiper1 = new Swiper(".home-slider", {
    loop: true,
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    autoplay: { delay: 3000 },
});

var swiper2 = new Swiper(".products-slider", {
    loop: true,
    centeredSlides: true,
    autoplay: { delay: 3000 },
    breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    },
});

// Run Init
updateCartUI();
fillForms();
attachAddToCart();