import { z } from "zod";

// create an object schema
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Email is required" })
    .min(3, { message: "Email must atleast 3 chars" })
    .max(40, { message: "Email must be not be greater than 20 chars" }),

  password: z
    .string({ required_error: "Email is required" })
    .min(3, { message: "password must atleast 3 chars" })
    .max(20, { message: "password must be not be greater than 20 chars" }),
});

const signupSchema = loginSchema.extend({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must atleast 3 chars" })
    .max(20, { message: "Name must be not be greater than 20 chars" }),
});

export default signupSchema;
