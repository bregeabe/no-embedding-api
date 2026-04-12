import initializeNode from "#root/init.js";
import { createConnection } from "mysql2";

initializeNode();

// connection options
const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  port: process.env.DB_PORT,
  database: process.env.DB_SCHEMA,
  dateStrings: true,
  timezone: "Z",
});

// seed database
console.log("Rebuilding Schema...");

db.connect((error) => {
  if (!error) {
    console.log("MySQL connection established.");
    console.log("Dropping Schema...");
    db.promise() // eslint-disable-line sonarjs/sql-queries
      .query(`DROP SCHEMA IF EXISTS ${process.env.DB_SCHEMA}`)
      .then(() => {
        console.log("Drop Schema Complete");
        console.log("Creating schema...");
        db.promise() // eslint-disable-line sonarjs/sql-queries
          .query(
            `CREATE SCHEMA IF NOT EXISTS ${process.env.DB_SCHEMA} DEFAULT CHARACTER SET utf8;
            USE ${process.env.DB_SCHEMA};`,
          )
          .then(() => {
            console.log("Schema created");
            process.exit(0);
          });
      })
      .catch((schemaError) => {
        console.log("ERROR: Schema Reset Failed!", schemaError);
        process.exit(1);
      });
  } else {
    console.log("MySQL connection failed!", error);
    process.exit(1);
  }
});
