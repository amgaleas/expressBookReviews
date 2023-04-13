const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    try {
        // Verificamos si existe el token
        if (!req.headers.authorization) {
            return res.status(404).json({ message: "No existe el token" });
        }

        // Verificar el token de autorización del encabezado eliminando la palabra "Bearer"
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "m1_clav3_s3cr3ta");
        if (!decoded) {
            return res.status(401).json({ message: "Token inválido" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
