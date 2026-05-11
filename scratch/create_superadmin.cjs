const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travo_ai'
  });

  try {
    const role_id = 1001;
    const password = 'Test@123';
    const password_hash = await bcrypt.hash(password, 12);
    
    // Ensure role exists
    const [roles] = await connection.query('SELECT * FROM roles WHERE id = ?', [role_id]);
    if (roles.length === 0) {
      console.log(`Creating role ${role_id}...`);
      await connection.query('INSERT INTO roles (id, role_name) VALUES (?, ?)', [role_id, 'Super Admin']);
    }

    const userData = {
      first_name: 'Super',
      last_name: 'Administrator',
      email: 'superadmin@travo.com',
      username: 'superadmin',
      phone: '1234567890',
      password_hash: password_hash,
      role_id: role_id,
      department: 1, // Defaulting to 1
      status: 'active',
      country: 1,
      state: 1,
      city: 1,
      join_date: new Date().toISOString().split('T')[0]
    };

    // Check if user already exists
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ? OR username = ?', [userData.email, userData.username]);
    if (existing.length > 0) {
      console.log('User already exists. Updating password and role...');
      await connection.query(
        'UPDATE users SET password_hash = ?, role_id = ?, status = "active" WHERE id = ?',
        [password_hash, role_id, existing[0].id]
      );
      console.log('User updated successfully.');
    } else {
      console.log('Creating new superadmin user...');
      await connection.query(`
        INSERT INTO users (
          first_name, last_name, email, username, phone, password_hash, 
          role_id, department, status, country, state, city, join_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userData.first_name, userData.last_name, userData.email, userData.username, 
        userData.phone, userData.password_hash, userData.role_id, userData.department, 
        userData.status, userData.country, userData.state, userData.city, userData.join_date
      ]);
      console.log('User created successfully.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

createSuperAdmin();
