import z from "zod";
export const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address " }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long " }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long. " })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character ",
        }
      ),
    collegeName: z.string().optional(),
    courseName: z.string().optional(),
    isOnline: z.boolean(),
    location: z.string().optional(),
  });