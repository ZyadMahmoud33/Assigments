const http = require('http');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'users.json');



function readData() {
  if (!fs.existsSync(dataFile)) {
    const initial = { users: {}, nextId: 1 };
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, obj) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function getRequestBody(req, callback) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    if (!body) return callback(null, {});
    try {
      callback(null, JSON.parse(body));
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('/').filter(Boolean); 
  const method = req.method;

  if (urlParts[0] !== 'user') {
    return sendJson(res, 404, { message: 'Route not found.' });
  }

  
  if (method === 'GET') {
    const data = readData();

    if (urlParts.length === 1) {
      const allUsers = Object.values(data.users);
      return sendJson(res, 200, allUsers);
    }

    const id = urlParts[1];
    const user = data.users[id];
    if (!user) {
      return sendJson(res, 404, { message: 'User not found.' });
    }
    return sendJson(res, 200, user);
  }

  // POST /user
  if (method === 'POST' && urlParts.length === 1) {
    return getRequestBody(req, (err, body) => {
      if (err) return sendJson(res, 400, { message: 'Invalid JSON body.' });

      const { name, age, email } = body;
      const data = readData();

      const emailExists = Object.values(data.users).some((u) => u.email === email);
      if (emailExists) {
        return sendJson(res, 400, { message: 'Email already exists.' });
      }

      const id = data.nextId;
      data.users[id] = { id, name, age, email };
      data.nextId += 1;

      writeData(data);
      return sendJson(res, 201, { message: 'User added successfully.' });
    });
  }

  // PATCH /user/:id
  if (method === 'PATCH' && urlParts.length === 2) {
    const id = urlParts[1];

    return getRequestBody(req, (err, body) => {
      if (err) return sendJson(res, 400, { message: 'Invalid JSON body.' });

      const data = readData();
      const user = data.users[id];

      if (!user) {
        return sendJson(res, 404, { message: 'User ID not found.' });
      }

      if (body.name !== undefined) user.name = body.name;
      if (body.age !== undefined) user.age = body.age;
      if (body.email !== undefined) user.email = body.email;

      data.users[id] = user;
      writeData(data);

      return sendJson(res, 200, { message: 'User updated successfully.' });
    });
  }

  // DELETE /user/:id
  if (method === 'DELETE' && urlParts.length === 2) {
    const id = urlParts[1];
    const data = readData();

    if (!data.users[id]) {
      return sendJson(res, 404, { message: 'User ID not found.' });
    }

    delete data.users[id];
    writeData(data);

    return sendJson(res, 200, { message: 'User deleted successfully.' });
  }

  return sendJson(res, 404, { message: 'Route not found.' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
