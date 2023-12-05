const Contenedor = require("./contenedor");
const express = require('express');
const app = express();
/*  Recordar que sea 8080 para glitch.me  */
const PORT = 8080;
const contenedor = new Contenedor("productos.json");

app.get('/', (req, res) => {
    res.send('Hola!')
});

app.get('/productos', async (req, res) => {
    const allProducts = await contenedor.getAll();
    const limit = parseInt(req.query.limit, 10);

    if (isNaN(limit)) {
        res.json(allProducts);
    } else {
        const limitedProducts = allProducts.slice(0, limit);
        res.json(limitedProducts);
    }
});

app.get('/productos/:id', async (req, res) => {
    const productId = req.params.id;
    console.log('ID recibido:', productId);

    const product = await contenedor.getById(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


app.get('/productoRandom', async (req, res) => {
    const allProducts = await contenedor.getAll();
    const maxId = allProducts.length;
    
    const randomNumber = generateRandomNumber(1, maxId);
    const randomProduct = await contenedor.getById(randomNumber);

    res.json(randomProduct);

})

app.get('/albums', (req, res) => {
    res.send('Hi, you are at Albums')
});

app.get('/object', (req, res) => {
    res.json({title: 'Are you experienced?', artist: 'The Jimi Hendrix Experience'})
});

const generateRandomNumber = (min, max) => {
    return Math.floor((Math.random() * (max+1 -min)) +min);
}

const server = app.listen(PORT, () => {
    console.log(`>>>> Server started at http://localhost:${PORT}`)
})

server.on('error', (error) => console.log(error));