import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases, storage } from './config';
import type { INewPost, INewUser } from '@/types';
import { ImageGravity } from "appwrite";


export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            ImageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    name: string;
    email: string;
    ImageUrl: string;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// ✅ SIGN IN ACCOUNT (deletes old session if any)
export async function signInAccount(user: { email: string; password: string }) {
    try {
        try {
            await account.deleteSession('current'); // Prevents duplicate session error
        } catch (err) {
            // No active session — safe to ignore
        }

        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error: any) {
        console.error("signInAccount error:", error.message, error.response);
        throw error;
    }
}

// FIX: Better error handling
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser.documents.length) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// ✅ SIGN OUT
export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error: any) {
        console.error("signOutAccount error:", error.message, error.response);
        throw error;
    }
}

// ✅ CHECK ACTIVE SESSION
export async function checkActiveSession() {
    try {
        const session = await account.getSession('current');
        return session;
    } catch (error: any) {
        console.error("checkActiveSession error:", error.message, error.response);
        return null;
    }
}


export async function createPost(post: INewPost){
    try{
        //Upload Image to the storage
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) throw Error;

        // Get File Url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw Error;
        }

        //Convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') ||[];

        // Save post to database
       const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            loaction: post.location,
            tags: tags
        }
       )

       if(!newPost) {
        await deleteFile(uploadedFile.$id)
        throw Error;
       }

       return newPost
        
    }catch(error) {
        console.log(error);
    }
}

export async function uploadFile(file:File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file    
        );
        return uploadedFile;
    } catch(error) {
        console.log(error);
    }
}


export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "north" as any,
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string){
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status : "ok" };
    } catch(error){
        console.log(error);
    }
}