const login = (req, res) => {
  const { username, password, role } = req.body;

  if (role === 'admin') {
    if (username === 'admin' && password === 'admin') {
      return res.status(200).json({ message: 'Admin login successful', token: 'mock-admin-token' });
    }
    return res.status(401).json({ message: 'Invalid admin credentials' });
  } else if (role === 'user') {
    if (username && password) {
      return res.status(200).json({ message: 'User login successful', token: 'mock-user-token' });
    }
    return res.status(400).json({ message: 'Username and password required' });
  }

  return res.status(400).json({ message: 'Invalid role' });
};

module.exports = {
  login
};
