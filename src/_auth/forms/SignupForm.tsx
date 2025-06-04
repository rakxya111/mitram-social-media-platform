import React from "react";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import { createUserAccount } from "@/lib/appwrite/api";



const SignupForm = () => {

  const isLoading = false;

  // 1. Define your form.

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: "",
      email:'',
      password: '',
    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof SignupValidation>) {
  const newUser = await createUserAccount(values); 
  console.log(newUser)
  
  }

  return (

      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo"  />

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new Account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">To use Mitram, please do enter your details </p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-5 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>    
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>    
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>    
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>    
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary mt-5">
            {isLoading ? (
              <div className="flex-center gap-2">
               <Loader/> Loading......
              </div>
            ): "Sign up"}
          </Button>
          <p className="text-small-regular text-center mt-2">
            Already have an account <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1 ">Log in</Link>
          </p>
        </form>
          </div>
      </Form>
 
  );
};

export default SignupForm;
