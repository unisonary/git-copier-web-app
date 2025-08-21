const express = require('express');
const cors = require('cors');
const path = require('path');
const { copyRepository, cleanupAllTempFiles } = require('./gitService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the client/public directory
app.use(express.static(path.join(__dirname, '../client/public')));

// API Routes
app.post('/api/copy-repository', async (req, res) => {
  try {
    const { sourceUrl, destinationUrl, authorName, authorEmail } = req.body;
    
    if (!sourceUrl || !destinationUrl) {
      return res.status(400).json({ 
        error: 'Source and destination URLs are required' 
      });
    }

    console.log(`🚀 Starting repository copy process...`);
    console.log(`📥 Source: ${sourceUrl}`);
    console.log(`📤 Destination: ${destinationUrl}`);
    console.log(`👤 New Author: ${authorName} <${authorEmail}>`);

    const result = await copyRepository(sourceUrl, destinationUrl, authorName, authorEmail);
    
    console.log(`✅ Repository copy completed successfully!`);
    
    res.json({
      success: true,
      message: 'Repository copied successfully',
      sourceUrl,
      destinationUrl,
      newAuthor: `${authorName} <${authorEmail}>`,
      result
    });

  } catch (error) {
    console.error(`❌ Error copying repository:`, error);
    res.status(500).json({ 
      error: error.message || 'Failed to copy repository' 
    });
  }
});

// Cleanup API endpoint
app.post('/api/cleanup', async (req, res) => {
  try {
    console.log(`🧹 Manual cleanup requested...`);
    const result = await cleanupAllTempFiles();
    
    res.json({
      success: true,
      message: 'Cleanup completed successfully',
      result
    });

  } catch (error) {
    console.error(`❌ Error during cleanup:`, error);
    res.status(500).json({ 
      error: error.message || 'Failed to cleanup temporary files' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Git Copier Web API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve the simple HTML app for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/simple-app.html'));
});

// Catch-all route - serve the simple HTML app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/simple-app.html'));
});

// Process exit handler for cleanup
process.on('SIGINT', async () => {
  console.log('\n🛑 Server shutting down...');
  try {
    await cleanupAllTempFiles();
    console.log('✅ Cleanup completed before shutdown');
  } catch (error) {
    console.error('❌ Error during shutdown cleanup:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Server terminating...');
  try {
    await cleanupAllTempFiles();
    console.log('✅ Cleanup completed before termination');
  } catch (error) {
    console.error('❌ Error during termination cleanup:', error);
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Git Copier Web Server running on port ${PORT}`);
  console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
  console.log(`📱 Simple HTML version is ready to use!`);
  console.log(`🧹 Auto-cleanup enabled - temporary files will be deleted after operations`);
  console.log(`🛑 Press Ctrl+C to stop the server (cleanup will happen automatically)`);
});
