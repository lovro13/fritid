const { db } = require('./database/db');
const User = require('./models/User');

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findByEmail('admin@fritid.com');
        
        if (existingAdmin) {
            console.log('Admin user already exists with email: admin@fritid.com');
            return;
        }

        // Create admin user
        const adminData = {
            firstName: 'Admin',
            lastName: 'Fritid',
            email: 'admin@fritid.com',
            password: 'admin123',
            role: 'admin'
        };

        const admin = await User.create(adminData);
        console.log('Admin user created successfully:');
        console.log('Email: admin@fritid.com');
        console.log('Password: admin123');
        console.log('Role:', admin.role);
        
        // Close database connection
        db.close();
        
    } catch (error) {
        console.error('Error creating admin user:', error);
        db.close();
    }
}

// Run the script
createAdminUser();
