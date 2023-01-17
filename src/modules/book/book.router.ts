import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as BookService from "./book.service";

export const bookRouter = express.Router();

// GET: List all the books
bookRouter.get("/", async (request: Request, response: Response) => {
  try {
    const books = await BookService.listBooks();
    return response.status(200).json(books);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// GET: A book based on the ID
bookRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const book = await BookService.getBook(id);
    if (book) {
      return response.status(200).json(book);
    }
    return response.status(404).json("Book could not be found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// POST: Create a book
// Params: title, datePublished, isFiction, authorId
bookRouter.post(
  "/",
  body("title").isString(),
  body("datePublished").isDate().toDate(),
  body("isFiction").isBoolean(),
  body("authorId").isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const book = request.body;
      const newBook = await BookService.createBook(book);
      return response.status(201).json(newBook);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// PUT: Updating a Book
// Params: title, datePublished, isFiction, authorId
bookRouter.put(
  "/:id",
  body("title").isString().optional({ nullable: true }),
  body("datePublished").isDate().toDate().optional({ nullable: true }),
  body("isFiction").isBoolean().optional({ nullable: true }),
  body("authorId").isInt().optional({ nullable: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
      const book = request.body;
      const updateBook = await BookService.updateBook(book, id);
      return response.status(201).json(updateBook);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// DELETE: Delete a book based on the ID
bookRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await BookService.deleteBook(id);
    return response.status(204).json();
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
