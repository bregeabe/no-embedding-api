import { createPool } from "mysql2";
import dotEnv from "dotenv";

dotEnv.config();

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_SCHEMA || 'noembedding',
  port: process.env.DB_PORT || 3306,
  dateStrings: true,
  timezone: "Z",
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
  multipleStatements: true,
});

// test pool
pool.query("SELECT 1 + 1 AS test", (error) => {
  if (error) {
    console.log("MySQL Error: \n", error);
  } else {
    console.log(
      "MySQL Connection Pool Created and Connection Established Successfully",
    );
  }
});

if (process.env.DB_LOGGING === "true") {
  // pool debugging
  pool.on("enqueue", function () {
    console.log("Waiting for available connection slot");
  });

  pool.on("acquire", function (connection) {
    console.log("Connection %d acquired", connection.threadId);
  });

  pool.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
  });
}

export default pool;
