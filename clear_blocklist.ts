import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Blocklist from './src/models/blockListModel';

async function clearBlocklist() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const result = await Blocklist.deleteMany({});
        console.log(`Successfully cleared blocklist. Deleted ${result.deletedCount} entries.`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to clear blocklist:', error);
        process.exit(1);
    }
}

clearBlocklist();
