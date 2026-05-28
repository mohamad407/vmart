let allProducts = [];

async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderProducts(allProducts);
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    if(products.length === 0) {
        grid.innerHTML = '<div class="empty-state">No products found</div>';
        return;
    }
    products.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${i * 0.1}s`;
        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${p.image}" alt="${p.productName}">
                <span class="badge ${p.condition.toLowerCase()}">${p.condition}</span>
            </div>
            <div class="card-content">
                <h3>${p.productName}</h3>
                <p class="price">₹${p.price}</p>
                <p class="category">${p.category}</p>
                <div class="seller-mini">
                    <img src="${p.sellerId?.profileImage || 'default.png'}" alt="seller">
                    <span>${p.sellerId?.name?.split(' ')[0] || 'Seller'}</span>
                </div>
                <a href="product.html?id=${p._id}" class="btn-view">View Details</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.dataset.category;
        renderProducts(cat === 'All' ? allProducts : allProducts.filter(p => p.category === cat));
    });
});

// Search
document.getElementById('search-input').addEventListener('input', e => {
    const search = e.target.value.toLowerCase();
    renderProducts(allProducts.filter(p => p.productName.toLowerCase().includes(search)));
});

fetchProducts();
