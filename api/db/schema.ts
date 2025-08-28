import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const studentID = t.pgTable("studentID", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t
    .varchar({
      length: 255,
    })
    .notNull(),
});

export const student = t.pgTable("student", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t
    .varchar({
      length: 255,
    })
    .notNull(),
  surname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  birthdayAt: t.timestamp().notNull(),

  studentId: t.bigint({ mode: "number" }).references(() => studentID.id, {
    onDelete: "set null",
  }),
  gender: t
    .varchar({
      length: 255,
    })
    .notNull(),
});

export const studentRelations = relations(student, ({ one }) => ({
  student: one(studentID, {
    fields: [student.studentId],
    references: [studentID.id],
  }),
}));

export const genres = t.pgTable("genres", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
});

export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
  author: t.varchar({ length: 255 }).notNull(),
  publishedAt: t.bigint({ mode: "number" }).notNull(),
  description: t.text().notNull(),
  synopsis: t.text().notNull(),
  categories: t.text().notNull(),
  genreId: t.bigint({ mode: "number" }).references(() => genres.id, {
    onDelete: "set null",
  }),
});

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, {
    fields: [books.genreId],
    references: [genres.id],
  }),
}));
