import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dropOldIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the User collection
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\nCurrent indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}:`, index.key);
    });

    // Drop the firebaseUID index if it exists
    try {
      await collection.dropIndex('firebaseUID_1');
      console.log('\n✅ Successfully dropped firebaseUID_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️  firebaseUID_1 index does not exist (already removed)');
      } else {
        throw error;
      }
    }

    // Show remaining indexes
    const remainingIndexes = await collection.indexes();
    console.log('\nRemaining indexes:');
    remainingIndexes.forEach(index => {
      console.log(`- ${index.name}:`, index.key);
    });

    console.log('\n✅ Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropOldIndexes();
