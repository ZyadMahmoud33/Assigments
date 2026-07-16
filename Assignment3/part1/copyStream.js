const fs = require('fs');

// Usage: node copyStream.js ./source.txt ./dest.txt
const source = process.argv[2] || './source.txt';
const dest = process.argv[3] || './dest.txt';

const readStream = fs.createReadStream(source);
const writeStream = fs.createWriteStream(dest);

readStream.on('error', (err) => {
  console.error('Read error:', err.message);
});

writeStream.on('error', (err) => {
  console.error('Write error:', err.message);
});

writeStream.on('finish', () => {
  console.log('File copied using streams');
});

readStream.pipe(writeStream);
