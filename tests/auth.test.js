const request = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    // Reset the in-memory users array before each test
    const authController = require('../src/controllers/authController');
    authController.users = [];
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register a user with an existing username', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      // Attempt to register again with the same username
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'newpassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should fail registration when username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail registration when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user to test login
      const hashedPassword = await bcrypt.hash('password123', 10);
      const authController = require('../src/controllers/authController');
      authController.users.push({ username: 'testuser', password: hashedPassword });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');

      // Verify the token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('username', 'testuser');
    });

    it('should fail login with incorrect username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail login when username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail login when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message');
    });
  });
});
