const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadProduct() {
    const res = await fetch(`${API_URL}/products/${id}`);
    const p = await res.json();
    document.getElementById('p-image').src = p.image;
    document.getElementById('p-name').innerText = p.productName;
    document.getElementById('p-price').innerText = `₹${p.price}`;
    document.getElementById('p-desc').innerText = p.description;
    document.getElementById('p-condition').innerText = p.condition;
    document.getElementById('p-qty').innerText = p.quantity;
    document.getElementById('p-seller-name').innerText = p.sellerId.name;
    document.getElementById('p-seller-phone').href = `tel:${p.sellerPhone}`;
    
    if(p.billImage) document.getElementById('p-bill').src = p.billImage;
    if(p.usedDuration) document.getElementById('p-used').innerText = `Used for: ${p.usedDuration}`;
    
    // Message Button
    document.getElementById('msg-btn').onclick = () => {
        window.location.href = `chat.html?productId=${p._id}&receiverId=${p.sellerId._id}&sellerName=${p.sellerId.name}`;
    };
}
loadProduct();
