import initializeNode from "#root/init.js";
import express from "express";
import cors from "cors";
import pool from "#root/db/config.js";

// Routes
import languagesRoutes from "#root/src/routes/languages.js";
import institutionsRoutes from "#root/src/routes/institutions.js";
import literatureRoutes from "#root/src/routes/literature.js";
import researchGroupsRoutes from "#root/src/routes/researchGroups.js";

initializeNode();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'No Embedding API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/languages', languagesRoutes);
app.use('/api/institutions', institutionsRoutes);
app.use('/api/literature', literatureRoutes);
app.use('/api/research-groups', researchGroupsRoutes);

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  pool.end(() => {
    console.log('Database connection pool closed.');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});