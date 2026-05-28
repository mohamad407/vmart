let imageFile, billFile;

document.getElementById('condition').addEventListener('change', e => {
    document.getElementById('used-details').style.display = e.target.value === 'Used' ? 'block' : 'none';
});
document.getElementById('category').addEventListener('change', e => {
    document.getElementById('bill-upload').style.display = e.target.value === 'Electronics' ? 'block' : 'none';
});

// Drag and Drop
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    imageFile = e.dataTransfer.files[0];
    previewImage(imageFile);
});
document.getElementById('image-input').addEventListener('change', e => {
    imageFile = e.target.files[0];
    previewImage(imageFile);
});

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
        dropZone.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
    };
    reader.readAsDataURL(file);
}

document.getElementById('sell-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', document.getElementById('pname').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('quantity', document.getElementById('qty').value);
    formData.append('description', document.getElementById('desc').value);
    formData.append('condition', document.getElementById('condition').value);
    formData.append('usedDuration', document.getElementById('used-dur').value);
    formData.append('sellerPhone', document.getElementById('phone').value);
    formData.append('sellerWhatsapp', document.getElementById('whatsapp').value);
    if(imageFile) formData.append('image', imageFile);
    if(document.getElementById('bill-input').files[0]) formData.append('billImage', document.getElementById('bill-input').files[0]);

    try {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        });
        if(res.ok) { showToast('Product Listed Successfully!'); window.location.href = 'buy.html'; }
    } catch (err) { showToast('Error uploading product'); }
});

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
