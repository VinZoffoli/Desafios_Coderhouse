const express = require('express');
const Contenedor = require('./src/contenedor');
const contenedor = new Contenedor("productos.json");
const app = express();
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la aplicación de productos!');
});

app.use('/api/productos', router);

router.get('/', async (req, res) => {
    const products = await contenedor.getAll();
    res.status(200).json(products);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await contenedor.getById(id);

    product
        ? res.status(200).json(product)
        : res.status(404).json({ error: "Producto no encontrado" });
});

router.post('/', async (req, res) => {
    const { body } = req;

    const { title, description, code, price, status, stock, category, thumbnails } = body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('Todos los campos son obligatorios, excepto thumbnails');
    }

    const newProduct = {
        title,
        description,
        code,
        price: Number(price),
        status: status || true,
        stock: Number(stock),
        category,
        thumbnails: thumbnails ? thumbnails.split(',') : []
    };

    const newProductId = await contenedor.save(newProduct);
    res.status(200).send(`Producto agregado con el ID: ${newProductId}`);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const wasUpdated = await contenedor.updateById(id, body);
    wasUpdated
        ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
        : res.status(404).send(`El producto no fue actualizado porque no se encontró el ID: ${id}`);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const wasDeleted = await contenedor.deleteById(id);
    wasDeleted
        ? res.status(200).send(`El producto de ID: ${id} fue borrado`)
        : res.status(404).send(`El producto no fue borrado porque no se encontró el ID: ${id}`);
});

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(` >>>>> 🚀 Server started at http://localhost:${PORT}`);
});

server.on('error', (err) => console.log(err));
