const { db } = require('../database/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.firstName = userData.first_name;
        this.lastName = userData.last_name;
        this.email = userData.email;
        this.passwordHash = userData.password_hash;
        this.address = userData.address;
        this.postalCode = userData.postal_code;
        this.city = userData.city;
        this.phoneNumber = userData.phone_number;
        this.role = userData.role || 'user';
        this.createdAt = userData.created_at;
    }

    static async findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new User(row)));
                }
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new User(row));
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new User(row));
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async emailExists(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    static async create(userData) {
        return new Promise((resolve, reject) => {
            const { firstName, lastName, email, password, role = 'user' } = userData;
            const passwordHash = bcrypt.hashSync(password, 10);

            db.run(
                'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                [firstName, lastName, email, passwordHash, role],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        User.findById(this.lastID).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    async save() {
        return new Promise((resolve, reject) => {
            if (this.id) {
                // Update existing user
                db.run(
                    `UPDATE users SET 
                     first_name = ?, last_name = ?, email = ?, 
                     address = ?, postal_code = ?, city = ?, phone_number = ?, role = ?
                     WHERE id = ?`,
                    [this.firstName, this.lastName, this.email, 
                     this.address, this.postalCode, this.city, this.phoneNumber, this.role, this.id],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    }
                );
            } else {
                reject(new Error('Cannot save user without ID'));
            }
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    async validatePassword(password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }

    isAdmin() {
        return this.role === 'admin';
    }

    static async createAdmin(userData) {
        return User.create({ ...userData, role: 'admin' });
    }

    toJSON() {
        const { passwordHash, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
}

module.exports = User;
