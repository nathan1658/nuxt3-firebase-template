import { z } from "zod";

export const PersonSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email format").toLowerCase(),
  age: z.number().int().min(0, "Age must be a positive number").max(150, "Age must be realistic"),
  phone: z.string().optional(),
  address: z.string().max(200, "Address must be less than 200 characters").optional(),
  department: z.string().max(50, "Department must be less than 50 characters").optional(),
  position: z.string().max(50, "Position must be less than 50 characters").optional(),
  salary: z.number().min(0, "Salary must be positive").optional(),
  hireDate: z.string().optional(), // ISO date string
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreatePersonSchema = PersonSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePersonSchema = PersonSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const PersonQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  department: z.string().optional(),
  sortBy: z.enum(["firstName", "lastName", "email", "age", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Person = z.infer<typeof PersonSchema>;
export type CreatePerson = z.infer<typeof CreatePersonSchema>;
export type UpdatePerson = z.infer<typeof UpdatePersonSchema>;
export type PersonQuery = z.infer<typeof PersonQuerySchema>;
