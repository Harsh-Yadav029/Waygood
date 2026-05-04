const mongoose = require("mongoose");
const env = require("../config/env");

async function cleanup() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB for cleanup");

    const University = mongoose.connection.collection("universities");
    
    console.log("Dropping all indexes from universities collection...");
    await University.dropIndexes();
    console.log("Successfully dropped all university indexes.");

    await mongoose.disconnect();
    console.log("Cleanup complete. You can now run the seed script.");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
}

cleanup();
