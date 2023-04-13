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
  new Promise((resolve, reject) => {
    // Verificar si existe al menos 1 elemento
    if (Object.keys(books).length > 0) {
      // Guardamos la información
      resolve(books);
    } else {
      // Guardamos un mensaje de error
      reject("El repositorio está vacío");
    }
  }).then((data) => {
    // Enviamos la información
    res.json(data);
  }).catch((error) => {
    // Enviamos el correspondiente mensaje en caso de error
    res.status(404).send(error);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    // Obtener el ISBN del parámetro de la URL
    const { isbn } = req.params;

    // Obtener el libro correspondiente al ISBN
    const bookISBN = Object.values(books).find(book => book.isbn === isbn);

    // Guardamos los resultados
    if (bookISBN) {
      resolve(bookISBN);
    } else {
      reject("No existe el libro con ISBN: " + isbn);
    }
  }).then((data) => {
    // Enviamos la información
    res.json(data);
  }).catch((error) => {
    // Enviamos el correspondiente mensaje en caso de error
    res.status(402).json({ message: error });
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    // Obtener el Autor del parámetro de la URL
    const { author } = req.params;

    // Obtener los libros correspondientes al Autor
    const bookAuthor = Object.values(books).filter(book => book.author === author);

    // Guardamos los resultados
    if (bookAuthor.length > 0) {
      resolve(bookAuthor);
    } else {
      reject("No existe libro con el Autor: " + author);
    }
  }).then((data) => {
    // Enviamos la información
    res.json(data);
  }).catch((error) => {
    // Enviamos el correspondiente mensaje en caso de error
    res.status(402).json({ message: error });
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    // Obtener el Título del parámetro de la URL
    const { title } = req.params;

    // Obtener los libros correspondientes al Título
    const bookTitle = Object.values(books).filter(book => book.title === title);

    // Guardamos los resultados
    if (bookTitle.length > 0) {
      resolve(bookTitle);
    } else {
      reject("No existe libro con el Título: " + title);
    }
  }).then((data) => {
    // Enviamos la información
    res.json(data);
  }).catch((error) => {
    // Enviamos el correspondiente mensaje en caso de error
    res.status(402).json({ message: error });
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Obtener el ISBN del parámetro de la URL
  const { isbn } = req.params;

  // Obtener el libro correspondiente al ISBN
  const bookISBN = Object.values(books).find(book => book.isbn === isbn);

  // Verificar si existe el libro
  if (!bookISBN) {
    return res.status(402).json({ message: "No existe libro con ISBN: " + isbn });
  }

  // Obtener las reseñas del libro
  const getReviews = new Promise((resolve, reject) => {
    // Guardamos los resultados
    if (bookISBN.reviews && Object.keys(bookISBN.reviews).length > 0) {
      resolve(bookISBN.reviews);
    } else {
      reject(new Error("No existen reseñas del libro con ISBN: " + isbn));
    }
  });

  getReviews
    // Enviamos la información
    .then(reviews => res.json(reviews))
    // Enviamos el correspondiente mensaje en caso de error
    .catch(error => res.status(402).json({ message: error.message }));
});

module.exports.general = public_users;
