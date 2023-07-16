import express from "express";
import __dirname from "./utils.js"
import handlebars from "express-handlebars";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/productRouter/product.router.js";
import cartsRouter from "./routes/cartRouter/cart.router.js";

const app = express();



app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars");
app.set('views', __dirname + '/views')

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

function obtenerProductosDesdeArchivoJSON() {
    const data = fs.readFileSync("productos.json", "utf8");
    const products = JSON.parse(data);
    return products;
}



app.get("/", (req, res) => {
    const products = obtenerProductosDesdeArchivoJSON();
    res.render("home", { products });
});


app.get("/realtimeproducts", (req, res) => {
    const products = obtenerProductosDesdeArchivoJSON();
    res.render("realTimeProducts", { products });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.set("io", io);


io.on("connection", (socket) => {
    console.log("Nueva conexión de WebSocket establecida");
    socket.on("newProduct", (product) => {
        console.log("Evento newProduct recibido:", product);
        io.emit("newProduct", product); 
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor HTTP y WebSocket escuchando en el puerto ${PORT}`);
});