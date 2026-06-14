import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/Users/User.js';
import ConnectDb from './Config/DB.js';

await ConnectDb();
const users = await User.find({}, 'name email role isApproved');
console.log(JSON.stringify(users, null, 2));
process.exit(0);
