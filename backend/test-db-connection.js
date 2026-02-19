const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected successfully!');

        // Check users
        const userSchema = new mongoose.Schema({ email: String, name: String, role: String }, { strict: false });
        const User = mongoose.model('User', userSchema);

        const users = await User.find({});
        console.log(`Total users in database: ${users.length}`);

        users.forEach(u => {
            console.log(`User: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ MongoDB Connection Failed!');
        console.error('Error Message:', err.message);
        process.exit(1);
    }
};

testConnection();
