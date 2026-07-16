const fs = require('fs');

// Usage: node readStream.js ./big.txt
const filePath = process.argv[2] || './big.txt';

const readStream = fs.createReadStream(filePath, {
  encoding: 'utf8',
  highWaterMark: 16 * 1024, // 16kb chunks
});

let chunkCount = 0;

readStream.on('data', (chunk) => {
  chunkCount++;
  console.log(`--- Chunk #${chunkCount} ---`);
  console.log(chunk);
});

readStream.on('end', () => {
  console.log(`Finished reading the file. Total chunks: ${chunkCount}`);
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err.message);
});
