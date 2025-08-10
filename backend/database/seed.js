const { db } = require('./db');
const bcrypt = require('bcryptjs');

const seedDatabase = () => {
    console.log('Seeding database with sample data...');

    // Sample users
    const users = [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            address: '123 Main St',
            postalCode: '1000',
            city: 'Ljubljana',
            phoneNumber: '+386 1 234 5678'
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            password: 'password123',
            address: '456 Oak Ave',
            postalCode: '2000',
            city: 'Maribor',
            phoneNumber: '+386 2 345 6789'
        }
    ];

    // Insert sample users
    users.forEach(user => {
        const passwordHash = bcrypt.hashSync(user.password, 10);
        db.run(
            `INSERT OR IGNORE INTO users 
             (first_name, last_name, email, password_hash, address, postal_code, city, phone_number) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user.firstName, user.lastName, user.email, passwordHash, 
             user.address, user.postalCode, user.city, user.phoneNumber],
            function(err) {
                if (err) {
                    console.error('Error inserting user:', err);
                } else if (this.changes > 0) {
                    console.log(`Inserted user: ${user.email}`);
                }
            }
        );
    });

    // Sample products from the frontend assets
    const products = [
        {
            name: 'Steklenička za kapljevine 100ml - kobalt modra',
            description: 'Visokokakovostna steklenička za shranjevanje kapljevin v kobalt modri barvi, prostornine 100ml.',
            price: 8.50,
            imageUrl: 'assets/steklenicka-kapljevine-100ml-kobalt-modra.jpeg',
            colors: JSON.stringify(['kobalt modra']),
            category: 'Stekleničke',
            stockQuantity: 50
        },
        {
            name: 'Steklenička za kapljevine 100ml - rjava',
            description: 'Visokokakovostna steklenička za shranjevanje kapljevin v rjavi barvi, prostornine 100ml.',
            price: 8.50,
            imageUrl: 'assets/steklenicka-kapljevine-100ml-rjava.jpeg',
            colors: JSON.stringify(['rjava']),
            category: 'Stekleničke',
            stockQuantity: 45
        },
        {
            name: 'Steklenička za kapljevine 10ml - kobalt modra',
            description: 'Kompaktna steklenička za shranjevanje kapljevin v kobalt modri barvi, prostornine 10ml.',
            price: 3.50,
            imageUrl: 'assets/steklenicka-kapljevine-10ml-kobalt-modra.jpeg',
            colors: JSON.stringify(['kobalt modra']),
            category: 'Stekleničke',
            stockQuantity: 100
        },
        {
            name: 'Steklenička za kapljevine 10ml - rjava',
            description: 'Kompaktna steklenička za shranjevanje kapljevin v rjavi barvi, prostornine 10ml.',
            price: 3.50,
            imageUrl: 'assets/steklenicka-kapljevine-10ml-rjava.jpeg',
            colors: JSON.stringify(['rjava']),
            category: 'Stekleničke',
            stockQuantity: 95
        },
        {
            name: 'Pokrovček s stekleno pipeto 100ml',
            description: 'Natančen pokrovček s stekleno pipeto za odmerjanje kapljevin, primeren za 100ml stekleničke.',
            price: 12.00,
            imageUrl: 'assets/pokrovcek-stekleno-pipeto-100ml.jpeg',
            colors: JSON.stringify(['transparentna']),
            category: 'Pokrovčki',
            stockQuantity: 30
        },
        {
            name: 'Pokrovček s stekleno pipeto 10ml',
            description: 'Natančen pokrovček s stekleno pipeto za odmerjanje kapljevin, primeren za 10ml stekleničke.',
            price: 8.00,
            imageUrl: 'assets/pokrovcek-stekleno-pipeto-10ml.jpeg',
            colors: JSON.stringify(['transparentna']),
            category: 'Pokrovčki',
            stockQuantity: 40
        },
        {
            name: 'Pokrovček s kapalko',
            description: 'Praktičen pokrovček s kapalko za enostavno odmerjanje kapljevin.',
            price: 5.50,
            imageUrl: 'assets/pokrovcek-s-kapalko.jpeg',
            colors: JSON.stringify(['transparentna']),
            category: 'Pokrovčki',
            stockQuantity: 60
        },
        {
            name: 'Čebelica embalaža med 150ml',
            description: 'Specializirana embalaža za med z motivi čebelic, prostornine 150ml.',
            price: 15.00,
            imageUrl: 'assets/cebelica-embalaza-med-150ml.jpeg',
            colors: JSON.stringify(['rumena', 'črna']),
            category: 'Specializirana embalaža',
            stockQuantity: 25
        },
        {
            name: 'Doža za shranjevanje živil 200ml',
            description: 'Praktična doža za shranjevanje živil, prostornine 200ml.',
            price: 10.50,
            imageUrl: 'assets/doza-shranjevanje-zivil-200ml.jpeg',
            colors: JSON.stringify(['bela']),
            category: 'Doze',
            stockQuantity: 35
        },
        {
            name: 'Prsilka univerzalna',
            description: 'Univerzalna prsilka za različne namene in kapljevine.',
            price: 7.50,
            imageUrl: 'assets/prsilka-univerzalna.jpeg',
            colors: JSON.stringify(['bela', 'transparentna']),
            category: 'Prsilke',
            stockQuantity: 40
        }
    ];

    // Insert sample products
    products.forEach(product => {
        db.run(
            `INSERT OR IGNORE INTO products 
             (name, description, price, image_url, colors, category, stock_quantity) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [product.name, product.description, product.price, product.imageUrl, 
             product.colors, product.category, product.stockQuantity],
            function(err) {
                if (err) {
                    console.error('Error inserting product:', err);
                } else if (this.changes > 0) {
                    console.log(`Inserted product: ${product.name}`);
                }
            }
        );
    });

    console.log('Database seeding completed!');
};

module.exports = { seedDatabase };
