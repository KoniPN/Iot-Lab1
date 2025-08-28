import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

/* (ตัวอย่าง) ตารางนักศึกษา */
export const studentIDs = t.pgTable("student_ids", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
});

export const student = t.pgTable("students", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  surname: t.varchar({ length: 255 }).notNull(),
  birthdayAt: t.timestamp().notNull(),
  studentId: t
    .bigint({ mode: "number" })
    .references(() => studentIDs.id, { onDelete: "set null" }),
  gender: t.varchar({ length: 255 }).notNull(),
});

export const studentRelations = relations(student, ({ one }) => ({
  studentIdRef: one(studentIDs, {
    fields: [student.studentId],
    references: [studentIDs.id],
  }),
}));

/* ตารางหนังสือ/หมวด */
export const genres = t.pgTable("genres", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
});

export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
  author: t.varchar({ length: 255 }).notNull(),
  publishedAt: t.timestamp().notNull(), // <<< กลับมาใช้ timestamp
  description: t.text(),
  synopsis: t.text(),
  categories: t.text(),
  genreId: t
    .bigint({ mode: "number" })
    .references(() => genres.id, { onDelete: "set null" }),
});

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, { fields: [books.genreId], references: [genres.id] }),
}));
