const bcrypt = require("bcrypt");
const { Admin } = require("../models");

// ==========================
// Login
// ==========================

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and Password are required.",
      });
    }

    const admin = await Admin.findOne({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password.",
      });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password.",
      });
    }

    req.session.user = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    };

    res.json({
      success: true,
      message: "Login Successful.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Logout
// ==========================

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({
      success: true,
    });
  });
};

// ==========================
// Check Login
// ==========================

exports.checkAuth = (req, res) => {
  if (req.session.user) {
    return res.json({
      authenticated: true,
      user: req.session.user,
    });
  }

  res.status(401).json({
    authenticated: false,
  });
};
// ==========================
// Change Password
// ==========================

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const admin = await Admin.findByPk(req.session.user.id);

    const validPassword = await bcrypt.compare(oldPassword, admin.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;

    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
