import mongoose from "mongoose";

const dbConnect = async ()=> {
    try {
        
        const url = process.env.MONGODB_URL;
        if(!url){
            throw new Error("Mongodb url not found");
        }

        await mongoose.connect(url);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect;
