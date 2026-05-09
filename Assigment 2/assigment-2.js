// Part 1 

// 1. 
function getFilePathInfo() {
  const path = require('path');
  const filePath = __filename;
  const dirPath = __dirname;
  console.log({ File: filePath, Dir: dirPath });
}
getFilePathInfo();

// 2. 
function getFileName(filePath) {
  const path = require('path');
  return path.basename(filePath);
}
console.log(getFileName("/user/files/report.pdf")); 

// 3. 
function buildPathFromObject(obj) {
  const path = require('path');
  return path.join(obj.dir, obj.name + '.' + obj.ext);
}
console.log(buildPathFromObject({ dir: "/folder", name: "app", ext: "js" })); 

// 4. 
function getFileExtension(filePath) {
  const path = require('path');
  return path.extname(filePath).replace('.', '');
}
console.log(getFileExtension("/docs/readme.md")); 

// 5. 
function parseFilePath(filePath) {
  const path = require('path');
  const name = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).replace('.', '');
  return { Name: name, Ext: ext };
}
console.log(parseFilePath("/home/app/main.js")); 

// 6. 
function isAbsolutePath(filePath) {
  const path = require('path');
  return path.isAbsolute(filePath);
}
console.log(isAbsolutePath("/home/user/file.txt")); 

// 7. 
function joinPathSegments(...segments) {
  const path = require('path');
  return path.join(...segments);
}
console.log(joinPathSegments("src", "components", "App.js"));  

// 8.    
function resolveRelativePath(relativePath) {
  const path = require('path');
  return path.resolve(relativePath);
}
console.log(resolveRelativePath("/index.js")); 

// 9. 
function joinTwoPaths(path1, path2) {
  const path = require('path');
  return path.join(path1, path2);
}
console.log(joinTwoPaths("/folder1", "folder2/file.txt"));  

// 10. 
const fs = require('fs');
function deleteFileAsync(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("حصل خطأ:", err);
    } else {
      console.log(`The ${path.basename(filePath)} is deleted.`);
    }
  });
}


// 11. 
function createFolderSync(folderPath) {
  const fs = require('fs');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log("Success");
  } else {
    console.log("Success");
  }
}
createFolderSync("./new-folder");

// 12. 
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on("start", () => {
  console.log("Welcome event triggered!");
});
emitter.emit("start");

// 13. 
emitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});
emitter.emit("login", "Ahmed");

  // 14.  
function readFileSyncFunc(filePath) {
  const fs = require('fs');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`the file content => "${content}"`);
  } catch (err) {
    console.log("مفيش الملف ياباشا");
  }
}
readFileSyncFunc("/notes.txt");

// 15. 
function writeFileAsync(filePath, content) {
  const fs = require('fs');
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log("خطأ:", err);
    } else {
      console.log("File saved");
    }
  });
}
writeFileAsync("/async.txt", "Async save");

// 16. 
function checkIfDirectoryExists(dirPath) {
  const fs = require('fs');
  return fs.existsSync(dirPath);
}
console.log(checkIfDirectoryExists("/notes.txt")); 

// 17. 
const os = require('os');
function getOSInfo() {
  return {
    Platform: os.platform(),
    Arch: os.arch()
  };
}
console.log(getOSInfo()); 

// Part 2

var findKthPositive = function(arr, k) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        let missing = arr[mid] - (mid + 1);
        
        if (missing < k) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left + k;
};

console.log(findKthPositive([2, 3, 4, 7, 11], 5));
