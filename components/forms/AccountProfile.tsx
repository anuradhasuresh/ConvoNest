"use client"

// import { ScriptProps } from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing} from "@/lib/uploadthing"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";

interface ScriptProps {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    }
    btnTitle: string;
}

const AccountProfile = ({user, btnTitle}: ScriptProps) => {
  const [ files, setFiles ] = useState<File[]>([])
  const { startUpload, isUploading} = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload completed:", res);
      // You might want to update the form or component state here
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      // Handle the error, maybe show a notification to the user
    },
    onUploadProgress: (progress: number) => {
      console.log(`Upload progress: ${progress}%`);
      // You could use this to update a progress bar
    },
  });

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof userValidation>) => {
      const blob = values.profile_photo;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.profile_photo = imgRes[0].url;
        }
      }
  }
    
  

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
      e.preventDefault();

      const fileReader = new FileReader();
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setFiles(Array.from(e.target.files))

          if(!file.type.includes('image')) return;

          fileReader.onload = async(event) => {
              const imageDataUrl = event.target?.result?.toString() || '';
              fieldChange(imageDataUrl);
          }
          fileReader.readAsDataURL(file);
      }
  }

  return (
      <Form {...form}>
      <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image_label">
                  {field.value ? (
                      <Image 
                          src = {field.value} 
                          alt = "Upload Profile Photo" 
                          className="rounded-full object-contain"
                          width = {96}
                          height = {96}
                          priority
                      />
                  ) : (
                      <Image 
                          src = "/assets/profile.svg" 
                          alt = "profile photo" 
                          className="rounded-full bg-gray-300 object-contain p-2"
                          width = {60}
                          height = {60}
                      /> 
                  )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input 
                      type="file" 
                      accept="image/*"
                      placeholder="upload a photo"
                      className="account-form_image-input" 
                      onChange={(e) => handleImage(e, field.onChange)}
                  />
              </FormControl>
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                  Name
              </FormLabel>
              <FormControl>
                <Input 
                      type="text"
                      className="account-form_input no-focus"
                      {...field}
                  />
              </FormControl>
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                  Username
              </FormLabel>
              <FormControl>
                <Input 
                      type="text"
                      className="account-form_input no-focus"
                      {...field}
                  />
              </FormControl>
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                  Bio
              </FormLabel>
              <FormControl>
                <Textarea  
                      rows={10}
                      className="account-form_input no-focus"
                      {...field}
                  />
              </FormControl>
              
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">{btnTitle}</Button>
      </form>
    </Form>
  );
};

export default AccountProfile;