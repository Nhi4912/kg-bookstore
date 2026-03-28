import { z } from "zod/v4";

// ─── Sign In ───

export const signInRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email chưa đúng định dạng"),
  password: z
    .string()
    .min(6, "Mật khẩu nên được đặt từ 6 kí tự trở lên"),
});

export const adminProfileSchema = z.object({
  id: z.string(),
  account_id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const signInResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  profile: adminProfileSchema,
});

// ─── Sign Up ───

export const signUpRequestSchema = z
  .object({
    name: z.string().min(1, "Tên không được để trống"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email chưa đúng định dạng"),
    password: z
      .string()
      .min(6, "Mật khẩu nên được đặt từ 6 kí tự trở lên"),
    confirm_password: z
      .string()
      .min(1, "Mật khẩu nhập lại không được để trống"),
    phone: z.string().nullable().optional(),
    url: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu nhập lại chưa trùng khớp",
    path: ["confirm_password"],
  });
