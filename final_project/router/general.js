const express = require('express');
let books = require("./booksdb.js");
let usuarios = require("./auth_users.js");
const public_users = express.Router();

// Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificamos que el username y la contraseña estén definidos
    if (username && password) {

      // Verificamos que el username respete el formato
      if (usuarios.isValid(username)) {

        // Registramos las credenciales del usuario
        usuarios.users.push({ username, password });

        // Devolvemos el mensaje de confirmación
        return res.status(200).json({ message: "Usuario registrado correctamente" });

      } else {
        return res.status(402).json({ message: "El nombre de usuario no es válido" });
      }
    } else {
      return res.status(401).json({ message: "Información inválida" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    // Verificar si existe al menos 1 elemento
    if (Object.keys(books).length > 0) {
      res.json(books);
    } else {
      res.status(404).send("El repositorio está vacío");
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  try {
    // Obtener el ISBN del parámetro de la URL
    const { isbn } = req.params;

    // Obtener el libro correspondiente al ISBN
    const bookISBN = Object.values(books).find(book => book.isbn === isbn);

    // Verificar si el libro
    if (bookISBN) {
      res.json(bookISBN);
    } else {
      return res.status(402).json({ message: "No existe el libro con ISBN: " + isbn });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    // Obtener el Autor del parámetro de la URL
    const { author } = req.params;

    // Obtener el libro correspondiente al Autor
    const bookAuthor = Object.values(books).filter(book => book.author === author);

    // Verificar si existe al menos 1 elemento
    if (bookAuthor.length > 0) {
      res.json(bookAuthor);
    } else {
      return res.status(402).json({ message: "No existe libro con el Autor: " + author });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  try {
    // Obtener el Título del parámetro de la URL
    const { title } = req.params;

    // Obtener el libro correspondiente al Título
    const bookTitle = Object.values(books).filter(book => book.title === title);

    // Verificar si existe al menos 1 elemento
    if (bookTitle.length > 0) {
      res.json(bookTitle);
    } else {
      return res.status(402).json({ message: "No existe libro con el Título: " + title });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    // Obtener el ISBN del parámetro de la URL
    const { isbn } = req.params;

    // Obtener el libro correspondiente al ISBN
    const bookISBN = Object.values(books).find(book => book.isbn === isbn);

    // Verificar si existe al menos 1 elemento
    if (bookISBN && bookISBN.reviews && Object.keys(bookISBN.reviews).length > 0) {
      res.json(bookISBN.reviews);
    } else {
      return res.status(402).json({ message: "No existen reseñas del libro con ISBN: " + isbn });
    }
  } catch (error) {
    return res.status(401).json({ message: "Ha ocurrido un error: " + error.message });
  }
});

module.exports.general = public_users;
