import { Author } from "../author/author.service";
import { db } from "../../utils/db.server";

type BookRead = {
  id: number;
  title: string;
  datePublished: Date;
  isFiction: boolean;
  author: Author;
  //   authorId: number;
};

type BookWrite = {
  title: string;
  datePublished: Date;
  isFiction: boolean;
  authorId: number;
};

export const listBooks = async (): Promise<BookRead[]> => {
  return await db.book.findMany({
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      //   authorId: true,
    },
  });
};

export const getBook = async (id: number): Promise<BookRead> => {
  return await db.book.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createBook = async (book: BookWrite): Promise<BookRead> => {
  const { title, datePublished, isFiction, authorId } = book;
  const parsedDate: Date = new Date(datePublished);

  return await db.book.create({
    data: {
      title,
      datePublished: parsedDate,
      isFiction,
      authorId,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateBook = async (
  book: Partial<BookWrite>,
  id: number
): Promise<BookRead> => {
  const { title, datePublished, isFiction, authorId } = book;
  let parsedDate: Date | undefined;
  if (datePublished instanceof Date) {
    parsedDate = new Date(datePublished);
  } else {
    parsedDate = undefined;
  }
  return await db.book.update({
    where: {
      id,
    },
    data: {
      title,
      datePublished: parsedDate,
      isFiction,
      authorId,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteBook = async (id: number): Promise<void> => {
  await db.book.delete({
    where: { id },
  });
};
