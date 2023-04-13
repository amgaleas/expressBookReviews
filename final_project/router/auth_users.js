const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Verificar los caracteres del nombre de usuario
const isValid = (username) => { //returns boolean
  const regex = /^[a-zA-Z\d]{0,32}$/;
  return regex.test(username);
}

// Verificar la autenticidad del usuario
const authenticatedUser = (username, password) => { //returns boolean
  // Buscar usuario en el arreglo 'users'
  const user = users.find(user => user.username === username);
  if (user && user.password === password) {
    // La contraseña coincide, autenticar al usuario
    return true;
  } else {
    // El usuario no existe o la contraseña no coincide, no se puede autenticar al usuario
    return false;
  }
}

// Sólo usuarios registrados se pueden loguear'
regd_users.post("/login", (req, res) => {
  // Extraemos los campos "username" y "password" del cuerpo de la solicitud.
  const { username, password } = req.body;

  // Verificar si el nombre de usuario y la contraseña son válidos
  if (!username || !password || !isValid(username)) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Verificar si el usuario está autenticado correctamente
  if (!authenticatedUser(username, password)) {
    return res.status(402).json({ message: "Autenticación fallida" });
  }

  // Si el usuario está autenticado correctamente, crear y devolver el token de acceso
  const accessToken = jwt.sign({ username: username }, "m1_clav3_s3cr3ta");
  return res.status(200).json({ accessToken: accessToken, message: "Se inició sesión correctamente" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {

    // Obtenemos el token de autorización del encabezado eliminando la palabra "Bearer"
    const token = req.headers.authorization.split(" ")[1];

    // Verificar el token
    const decoded = jwt.verify(token, "m1_clav3_s3cr3ta");

    // Obtener el ISBN del parámetro de la URL
    const { isbn } = req.params;

    // Obtener la calificación y el comentario del cuerpo de la solicitud
    const { rating, comment } = req.body;

    // Obtener el libro correspondiente al ISBN
    const bookISBN = Object.values(books).find(book => book.isbn === isbn);

    // Verificar el libro existe
    if (bookISBN) {
      // Personalizamos el mensaje de éxito
      const mensaje = bookISBN.reviews[decoded.username] ? "Reseña agregada con éxito" : "Reseña actualizada con éxito";

      // Agregar o actualizar reseña
      bookISBN.reviews[decoded.username] = {
        rating: rating,
        comment: comment,
        date: Date.now()
      };

      return res.status(200).json({ message: mensaje });
    } else {
      return res.status(402).json({ message: "No existe el libro al cual desea acceder" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {

    // Obtenemos el token de autorización del encabezado eliminando la palabra "Bearer"
    const token = req.headers.authorization.split(" ")[1];

    // Verificar el token
    const decoded = jwt.verify(token, "m1_clav3_s3cr3ta");

    // Obtener el ISBN del parámetro de la URL
    const { isbn } = req.params;

    // Obtener el libro correspondiente al ISBN
    const bookISBN = Object.values(books).find(book => book.isbn === isbn);

    // Verificar si el libro existe
    if (bookISBN) {
      // Personalizamos el mensaje de éxito
      const mensaje = bookISBN.reviews[decoded.username] ? "Reseña eliminada con éxito" : "No existe reseña que desea eliminar eliminar";

      // Eliminar la reseña del usuario
      delete bookISBN.reviews[decoded.username];

      return res.status(200).json({ message: mensaje });
    } else {
      return res.status(402).json({ message: "No existe el libro al cual desea acceder" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
