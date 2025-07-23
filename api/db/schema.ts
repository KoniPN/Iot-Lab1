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
