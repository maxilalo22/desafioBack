import express from "express";
import fs from "fs";
import { Router } from "express";
import cartModel from "../../DAO/models/cart.model.js"
import Product from "../../DAO/models/products.model.js"

const cartsRouter = express.Router();

let cartIdCounter = 1;

cartsRouter.post("/", (req, res) => {
    const newCart = {
        id: cartIdCounter,
        products: [],
    };

    try {
    
        cartIdCounter++;

        
        fs.readFile("carrito.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al leer el carrito." });
            }

            const carts = JSON.parse(data);

           
            carts.push(newCart);

            
            fs.writeFile("carrito.json", JSON.stringify(carts), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Error al guardar el carrito." });
                }

                return res.json(newCart);
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al crear el carrito." });
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  
  try {
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }


    let cart = await Cart.findById(cid);
    if (!cart) {
  
      cart = new Cart({ _id: cid, products: [] });
    }

   
    const cartItem = cart.products.find((item) => item.product.toString() === pid.toString());

    if (cartItem) {
  
      cartItem.quantity += 1;
    } else {

      cart.products.push({ product: pid, quantity: 1 });
    }


    await cart.save();

    return res.json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al agregar el producto al carrito." });
  }
});

cartsRouter.get("/:cid", (req, res) => {
    const cid = parseInt(req.params.cid);

    fs.readFile("carrito.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al leer el carrito." });
        }

        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado." });
        }

        return res.json(cart.products);
    });
});

export default cartsRouter;
