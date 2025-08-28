import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { student, books } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentRouter = new Hono();
const booksRouter = new Hono();

studentRouter.get("/", async (c) => {
  const db = drizzle(c);
  const allStudents = await db.select().from(student);
  return c.json(allStudents);
});

studentRouter.get("/:id", async (c) => {
  const db = drizzle(c);
  const id = Number(c.req.param("id"));
  const result = await db.query.student.findFirst({
    where: eq(student.id, id),
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      surname: z.string().min(1),
      birthdayAt: z.iso
        .datetime({ offset: true })
        .transform((v) => dayjs(v).toDate()),
      studentId: z.number().int().nullable().optional(),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const db = drizzle(c);
    const { name, surname, birthdayAt, studentId, gender } =
      c.req.valid("json");
    const result = await db
      .insert(student)
      .values({
        name,
        surname,
        gender,
        birthdayAt,
        studentId: studentId ?? null,
      })
      .returning();
    return c.json({ success: true, student: result[0] }, 201);
  }
);

studentRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).optional(),
      surname: z.string().min(1).optional(),
      gender: z.string().min(1).optional(),
      birthdayAt: z.iso
        .datetime({ offset: true })
        .optional()
        .transform((v) => (v ? dayjs(v).toDate() : undefined)),
      studentId: z.number().int().nullable().optional(),
    })
  ),
  async (c) => {
    const db = drizzle(c);
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await db
      .update(student)
      .set(data)
      .where(eq(student.id, id))
      .returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, student: updated[0] });
  }
);

studentRouter.delete("/:id", async (c) => {
  const db = drizzle(c);
  const id = Number(c.req.param("id"));
  const deleted = await db
    .delete(student)
    .where(eq(student.id, id))
    .returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, student: deleted[0] });
});

booksRouter.get("/", async (c) => {
  const db = drizzle(c);
  const allBooks = await db.select().from(books);
  return c.json(allBooks);
});

booksRouter.get("/:id", async (c) => {
  const db = drizzle(c);
  const id = Number(c.req.param("id"));
  const result = await db.query.books.findFirst({
    where: eq(books.id, id),
    with: { genre: true },
  });
  if (!result) {
    return c.json({ error: "Book not found" }, 404);
  }
  return c.json(result);
});

booksRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1),
      author: z.string().min(1),
      publishedAt: z.iso
        .datetime({ offset: true })
        .transform((v) => dayjs(v).toDate()),
      genreId: z.number().int().nullable().optional(),
      description: z.string(),
      synopsis: z.string(),
      categories: z.string(),
    })
  ),
  async (c) => {
    const db = drizzle(c);
    const {
      title,
      author,
      publishedAt,
      genreId,
      description,
      synopsis,
      categories,
    } = c.req.valid("json");
    const result = await db
      .insert(books)
      .values({
        title,
        author,
        publishedAt,
        genreId: genreId ?? null,
        description,
        synopsis,
        categories,
      })
      .returning();
    return c.json({ success: true, book: result[0] }, 201);
  }
);

booksRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      publishedAt: z.iso
        .datetime({ offset: true })
        .optional()
        .transform((v) => (v ? dayjs(v).toDate() : undefined)),
      genreId: z.number().int().nullable().optional(),
      description: z.string().optional(),
      synopsis: z.string().optional(),
      categories: z.string().optional(),
    })
  ),
  async (c) => {
    const db = drizzle(c);
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await db
      .update(books)
      .set(data)
      .where(eq(books.id, id))
      .returning();
    if (updated.length === 0) {
      return c.json({ error: "Book not found" }, 404);
    }
    return c.json({ success: true, book: updated[0] });
  }
);

booksRouter.delete("/:id", async (c) => {
  const db = drizzle(c);
  const id = Number(c.req.param("id"));
  const deleted = await db.delete(books).where(eq(books.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Book not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export { studentRouter, booksRouter };
