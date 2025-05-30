const http = require('http');

// Simple HTTP request to check if the server is running
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000 // 5 seconds timeout
};

console.log('Checking if development server is running...');

const req = http.request(options, (res) => {
  console.log(`Server responded with status code: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Development server is running successfully!');
    process.exit(0);
  } else {
    console.log('❌ Server responded with an error status code');
    process.exit(1);
  }
});

req.on('error', (error) => {
  console.error('❌ Error connecting to development server:', error.message);
  console.log('The server might not be running or there might be compilation errors.');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
  process.exit(1);
});

req.end(); 