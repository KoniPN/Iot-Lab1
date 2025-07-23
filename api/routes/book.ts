import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { student } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentRouter = new Hono();

studentRouter.get("/", async (c) => {
  const allBooks = await drizzle.select().from(student);
  return c.json(allBooks);
});

studentRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.student.findFirst({
    where: eq(student.id, id),
    with: {
      student: true,
    },
  });
  if (!result) {
    return c.json({ error: "Book not found" }, 404);
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
        .transform((data) => dayjs(data).toDate()),
      studentId: z.number().int().optional().nullable(),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const { name, surname, birthdayAt, studentId, gender } =
      c.req.valid("json");
    const result = await drizzle
      .insert(student)
      .values({
        name,
        surname,
        gender,
        birthdayAt,
        studentId: studentId ?? null,
      })
      .returning();
    return c.json({ success: true, book: result[0] }, 201);
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
        .datetime({
          offset: true,
        })
        .optional()
        .transform((data) => (data ? dayjs(data).toDate() : undefined)),
      studentId: z.number().int().optional().nullable().optional(),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle
      .update(student)
      .set(data)
      .where(eq(student.id, id))
      .returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, book: updated[0] });
  }
);

studentRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle
    .delete(student)
    .where(eq(student.id, id))
    .returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export default studentRouter;
