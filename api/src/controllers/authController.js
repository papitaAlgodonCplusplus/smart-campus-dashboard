import User from '/opt/render/project/src/api/src/models/User.js';
// import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, studentId, faculty, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { studentId }]
    });

    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email 
          ? 'Este correo electrónico ya está registrado' 
          : 'Este carné estudiantil ya está registrado' 
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      studentId,
      faculty,
      password
    });

    if (user) {
      // Create token
      const token = generateToken(user._id);

      // Return user data and token
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        token
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error.message || 'Error durante el registro. Intente nuevamente.' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      // Update last login time
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });

      // Generate token
      const token = generateToken(user._id);

      // Return user data and token
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        token
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Error durante el inicio de sesión. Intente nuevamente.' 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Error al obtener perfil. Intente nuevamente.' 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.faculty = req.body.faculty || user.faculty;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // Generate new token
      const token = generateToken(updatedUser._id);

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        faculty: updatedUser.faculty,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
        token
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Error al actualizar perfil. Intente nuevamente.' 
    });
  }
};