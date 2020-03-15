const express = require('express'),
      Book    = require('../models').Book,
      router  = express.Router();

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// Shows the full list of books

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('books/index', { books, title : "Books" });
}));

// Shows the create new book form.

router.get('/new', (req, res) => {
  res.render('books/new', { book : {}, title : "New Book" });
});

/* POST create book. */

router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new", { book, errors : error.errors, title : "New Book" })
    } else {
      throw error;
    }
  }
}));

/* GET individual book. */

router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    res.render("books/show", { book, title : book.title });
  } else {
    res.sendStatus(500);
  }
}));

/* Update a book. */

router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;

  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/");
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("/books/" + books.id + "/edit", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete individual book. */

router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(500);
  }
}));

module.exports = router;
