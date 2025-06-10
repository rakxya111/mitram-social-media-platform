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