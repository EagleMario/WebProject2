const jwt=require('jsonwebtoken');
const User=require('../Model/User.js');
const { roundToNearestMinutes } = require('date-fns');

exports.protect=async(req,res,next)=>{
  try{
    let token;

    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1];
    }
    if(!token){
      console.log('No token provided in request to:', req.path);
      return res.status(401).json({message:"login first"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log('Token verified for user:', decoded.id);

    const currentUser=await User.findById(decoded.id);
    if(!currentUser){
      console.log('User not found for id:', decoded.id);
      return res.status(401).json({message:"Error :)"});
    }
    console.log('User authenticated:', { id: currentUser._id, role: currentUser.role, email: currentUser.email });
    req.user=currentUser;
    next();
  }catch(error){
    console.error('Auth error:', error.message);
    res.status(401).json({message:"the token is expired !"});
  }
};
exports.restrictTo=(...roles)=>{
  return (req,res,next)=>{

    const userRole = req.user.role.toLowerCase();
    const authorizedRoles = roles.map(role => role.toLowerCase());

    if (!authorizedRoles.includes(userRole)) {
      return res.status(401).json({ message: "you Can't do that" });
    }
    next();
  };
};