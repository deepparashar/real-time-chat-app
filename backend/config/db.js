import mongoose from "mongoose";


const connectDB = async () => {
    // Connect to MongoDB
    mongoose.connection.on('connected',() => {
        console.log('MongoDB connected...');
    })
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/rtc`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export {
    connectDB
    
}