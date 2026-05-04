require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User.js');

const ConnectDb = require('../Config/DB.js');



const seedManagers = async () => {

    try {
        await ConnectDb();

        const Managers = [

            {
                name: 'MarioManager',
                email: 'MarioMounir@gmail.com',
                password: 'MM1082004',
                role: 'Manager'
            },
            {
                name: 'MichaelManager',
                email: 'MichaelMounir@gamil.com',
                password: 'MM121096',
                role: 'Manager'
            }

        ];

        for (let m of Managers) {
            const existingUser = await User.findOne({ email: m.email });

            if (!existingUser) {

                const hashedpassword = await bcrypt.hash(m.password, 12);

                await User.create({
                    ...m,
                    password: hashedpassword

                });
                console.log(`✅ Welcome back ${m.email}`);
            }
            else {
                console.log(`🟡 Manager already logged in : ${m.email}`);
            }
        }
        console.log('🚀 Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding managers:', error);
        process.exit(1);
    }
};
seedManagers();