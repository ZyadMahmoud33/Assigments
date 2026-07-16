const { User } = require('../models');

// POST /users/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const user = User.build({ name, email, password, role });
    await user.save();

    return res.status(201).json({ message: 'User added successfully.' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// PUT /users/:id -> create or update based on PK, skip validation
exports.createOrUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    let user = await User.findByPk(id);

    if (user) {
      user.set({ name, email, password, role });
      await user.save({ validate: false });
    } else {
      user = User.build({ id, name, email, password, role });
      await user.save({ validate: false });
    }

    return res.status(200).json({ message: 'User created or updated successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET /users/by-email?email=
exports.getByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'no user found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /user/:id -> excluding the "role" field
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['role'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'no user found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
