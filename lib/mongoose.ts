import mongoose from  "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log('MongoDB_URL not found');
    if(isConnected) {
        console.log("Already connected to MongoDB");
        return;
    } 

    try {
        console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log('Connected to MongoDB');
    }
    catch(error) {
        console.log(error);
    }
}