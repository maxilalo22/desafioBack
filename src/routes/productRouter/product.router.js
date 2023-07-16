import  express  from "express";
import fs from "fs"
import {Router} from "express"


const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos.' });
        }
        const products = JSON.parse(data);
        res.render('home', { products }); 
    });
});


productsRouter.get('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid, 10);

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos.' });
        }
        const products = JSON.parse(data);
        const product = products.find((p) => p.id === pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(product);
    });
});



function generateNextId(products) {
    if (products.length === 0) {

        return 1;
    }


    const maxId = products.reduce((max, product) => {
        return product.id > max ? product.id : max;
    }, 0);


    return maxId + 1;
}


productsRouter.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos.' });
        }

        const products = JSON.parse(data);

        const id = generateNextId(products);

        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails,
        };

        products.push(newProduct);

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al agregar el producto.' });
            } 

            res.status(201).json(newProduct);
        });
    });
});



productsRouter.put('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid, 10);
    const updatedProduct = req.body;

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos.' });
        }

        const products = JSON.parse(data);
        const productIndex = products.findIndex((p) => p.id === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        products[productIndex] = { ...products[productIndex], ...updatedProduct };

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al actualizar el producto.' });
            }
            res.json(products[productIndex]);
        });
    });
});


productsRouter.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid, 10);

    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos.' });
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex((p) => p.id === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        products = products.filter((p) => p.id !== pid);

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al eliminar el producto.' });
            }
            res.json({ message: 'Producto eliminado correctamente.' });
        });
    });
});

export default productsRouter

