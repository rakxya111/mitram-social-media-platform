import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, {message : 'The name is too short'}),
  username: z.string().min(2, {message : "The username is too Short"}),
  email: z.string().email(),
  password: z.string().min(8,{ message : 'The password must of atleast 8 characters .'}),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8,{ message : 'The password must of atleast 8 characters .'}),
});

export const PostValidation = z.object({
  caption : z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(3, { message: 'The name is too short' }),
  username: z.string().min(3, { message: "The username is too Short" }),
  email: z.string().email(),
  bio: z.string().max(2200),
});