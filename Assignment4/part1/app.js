const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const dataFile = path.join(__dirname, 'users.json');

// data shape in the json file:
// { "users": { "1": { id, name, age, email }, ... }, "nextId": 2 }

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

// ----- 1. POST /user -----
app.post('/user', (req, res) => {
  const { name, age, email } = req.body;
  const data = readData();

  const emailExists = Object.values(data.users).some((u) => u.email === email);
  if (emailExists) {
    return res.status(400).json({ message: 'Email already exists.' });
  }

  const id = data.nextId;
  data.users[id] = { id, name, age, email };
  data.nextId += 1;

  writeData(data);
  return res.status(201).json({ message: 'User added successfully.' });
});

// ----- 4. GET /user/getByName?name= -----
// NOTE: this route must be declared before "/user/:id"
app.get('/user/getByName', (req, res) => {
  const { name } = req.query;
  const data = readData();

  const user = Object.values(data.users).find((u) => u.name === name);
  if (!user) {
    return res.status(404).json({ message: 'User name not found.' });
  }
  return res.status(200).json(user);
});

// ----- 6. GET /user/filter?minAge= -----
// NOTE: this route must be declared before "/user/:id"
app.get('/user/filter', (req, res) => {
  const minAge = Number(req.query.minAge);
  const data = readData();

  const result = Object.values(data.users).filter((u) => u.age >= minAge);
  if (result.length === 0) {
    return res.status(404).json({ message: 'no user found' });
  }
  return res.status(200).json(result);
});

// ----- 5. GET /user -----
app.get('/user', (req, res) => {
  const data = readData();
  return res.status(200).json(Object.values(data.users));
});

// ----- 7. GET /user/:id -----
app.get('/user/:id', (req, res) => {
  const data = readData();
  const user = data.users[req.params.id];

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.status(200).json(user);
});

// ----- 2. PATCH /user/:id -----
app.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const user = data.users[id];

  if (!user) {
    return res.status(404).json({ message: 'User ID not found.' });
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.age !== undefined) user.age = req.body.age;
  if (req.body.email !== undefined) user.email = req.body.email;

  data.users[id] = user;
  writeData(data);

  return res.status(200).json({ message: 'User updated successfully.' });
});

// ----- 3. DELETE /user/:id  (id can come from params or from body) -----
app.delete('/user/:id?', (req, res) => {
  const id = req.params.id || req.body.id;
  const data = readData();

  if (!id || !data.users[id]) {
    return res.status(404).json({ message: 'User ID not found.' });
  }

  delete data.users[id];
  writeData(data);

  return res.status(200).json({ message: 'User deleted successfully.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
