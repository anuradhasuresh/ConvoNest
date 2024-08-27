"use server"

import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Convo from "../models/convo.model";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
        userId,
        username,
        name,
        bio,
        image,
        path,
    } : Params) : Promise<void> {

    connectToDB();
    // console.log("called update")
    try {
        await User.findOneAndUpdate(
            { id: userId },
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboardedStatus: true,
            },
            { upsert: true }
        );
        if( path === '/profile/edit') {
            revalidatePath(path);
        }
    
    }
    catch (error: any) {
        throw new Error (`failed to create/ update user : ${error.message}`);
    }
}
export async function fetchUser (userId : String) {
    try {
        connectToDB();
        return await User
        .findOne({ id: userId })
        // .populate({
        //     path : 'communities',
        //     model : Community, 
        // })
    }
    catch (error: any) { 
        throw new Error(`failed to fetch user: ${error.message}`)
    }
}
export async function fetchUserPosts(userId: string) {
    try {
      connectToDB();
  
      // Find all convos authored by the user with the given userId
      const convos = await User.findOne({ id: userId }).populate({
        path: "convos",
        model: Convo,
        populate: [
        //   {
        //     path: "community",
        //     model: Community,
        //     select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        //   },
          {
            path: "children",
            model: Convo,
            populate: {
              path: "author",
              model: User,
              select: "name image id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      });
      return convos;
    } catch (error) {
      console.error("Error fetching user convos:", error);
      throw error;
    }
  }