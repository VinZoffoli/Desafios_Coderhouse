const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            alert('Producto agregado con éxito');
            addProductForm.reset();
        } else {
            alert('Error al agregar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
