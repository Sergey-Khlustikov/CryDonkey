import connectDB from "#src/config/db.js";
import runSeeders from "#src/db/seeders/index.js";

const resetDb = async () => {
  const db = await connectDB();

  if (!db.connection.db) {
    throw new Error("MongoDB connection failed");
  }

  try {
    await db.connection.db.dropDatabase();

    await runSeeders()
  } catch (error) {
    console.error(error);
  } finally {
    await db.connection.close();
  }
}

resetDb();
