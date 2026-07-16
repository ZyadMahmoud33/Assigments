const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');

// Usage: node pipelineGzip.js ./data.txt ./data.txt.gz
const source = process.argv[2] || './data.txt';
const dest = process.argv[3] || './data.txt.gz';

const readStream = fs.createReadStream(source);
const gzip = zlib.createGzip();
const writeStream = fs.createWriteStream(dest);

pipeline(readStream, gzip, writeStream, (err) => {
  if (err) {
    console.error('Pipeline failed:', err.message);
  } else {
    console.log(`File compressed successfully -> ${dest}`);
  }
});
