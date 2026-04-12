import initializeNode from "#root/init.js";
import { readdirSync, readFileSync, existsSync } from "fs";
import { createConnection } from "mysql2/promise";
import dotEnv from "dotenv";

dotEnv.config();

initializeNode();

async function executeSeedFiles(db, directoryName) {
  if (!existsSync(directoryName)) {
    console.log(`Directory ${directoryName} does not exist, skipping...`);
    return;
  }

  const files = readdirSync(directoryName).filter(file => file.endsWith('.sql'));
  
  if (files.length === 0) {
    console.log("No .sql seed files found.");
    return;
  }

  console.log("Executing seed files:");
  for (const file of files) {
    console.log(" - ", file);
    const path = directoryName + "/" + file;
    const sqlContent = readFileSync(path).toString().trim();
    
    if (sqlContent) {
      await db.query(sqlContent);
    } else {
      console.log(`   (File ${file} is empty, skipping)`);
    }
  }
}

async function executeSchemaFile(db, filePath) {
  try {
    console.log(`Executing schema file: ${filePath}`);
    const sqlContent = readFileSync(filePath).toString().trim();
    
    if (sqlContent) {
      await db.query(sqlContent);
      console.log("Schema created successfully");
    } else {
      console.log("Schema file is empty");
    }
  } catch (error) {
    console.error(`Error executing schema file ${filePath}:`, error);
    throw error;
  }
}

async function main() {
  try {
    const db = await createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      multipleStatements: true,
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_SCHEMA || 'noembedding',
      dateStrings: true,
      timezone: "Z",
    });

    console.log("Setting up database...");
    console.log("MySQL connection established.");
    
    console.log("\nCreating database schema...");
    await executeSchemaFile(db, "./db/model/create_db.sql");
    
    console.log("\nSeeding database with initial data...");
    await executeSeedFiles(db, "./db/seeders");

    console.log("\nDatabase setup and seeding complete!");
    await db.end();
    process.exit(0);
  } catch (creationError) {
    console.log("ERROR: Database setup failed", creationError);
    process.exit(1);
  }
}

main();
