import  express  from "express";
import fs from "fs"
import { Router } from "express"

const cartsRouter = express.Router();

let cartIdCounter = 1;


cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: cartIdCounter,
        products: []
    }
});

cartIdCounter++;

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer el carrito.' });
        }

        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        cart.products.push({
            product: pid,
            quantity: 1
        });

        fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al guardar el carrito.' });
            }

            const io = req.app.get("io");
            io.emit("updateProducts", cart.products); // Emitir evento de WebSocket para informar sobre la actualización

            res.json(cart);
        });
    });
});


cartsRouter.get('/:cid', (req, res) => {
    const cid = parseInt(req.params.cid);

    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer el carrito.' });
        }

        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        res.json(cart.products);
    });
});

export default cartsRouter