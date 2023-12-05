const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
try{  
   const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({message: "Please Enter all the Feilds"});
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({message: "User already exists"});
  }

  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    console.log("user created successfully")
    res.status(201).json({
      message: "User created successfully",
    });
  } else {
    res.status(400).json({message: "Something went wrong"});
  }
}catch(err) {
    console.log("something went wrong")
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({message: "Please Enter all the Feilds"});
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      message: "User logged in successfully",
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({message:"Invalid Email or Password"});
  }
});

const updateUserDetails = async (req, res) => {
  try {
    // const userId = req.params.id;
    const userId = req.user.id;

    const { carName, carType, vehicleNumber } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, 
      {
        $set: {
          carName: carName,
          carType: carType,
          vehicleNumber: vehicleNumber,
        },
      },
      { new: true } 
    );
    

    const outputUser = {
      id: user.id,
      username: updatedUser.name,
      email: updatedUser.email,
      carName: updatedUser.carName || null,
      carType: updatedUser.carType || null,
      vehicleNumber: updatedUser.vehicleNumber || null,
    };

    res.json({ message: 'User details updated successfully', outputUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const outputUser = {
      id: user.id,
      username: user.name,
      email: user.email,
      carName: user.carName || null,
      carType: user.carType || null,
      vehicleNumber: user.vehicleNumber || null,
    };

    res.json(outputUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { registerUser, authUser ,
   updateUserDetails, 
   getUserDetails
};