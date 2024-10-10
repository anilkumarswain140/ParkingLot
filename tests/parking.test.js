const request = require('supertest');
const app = require('../src/app');
const parkingService = require('../src/services/parkingService');
const jwt = require('jsonwebtoken');
// Mock the parkingService methods
jest.mock('../src/services/parkingService');

describe('Parking Endpoints', () => {
  let token;

  beforeAll(async () => {
    // Register and login a user to obtain a JWT token
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'parkingUser',
        password: 'parkingPass123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'parkingUser',
        password: 'parkingPass123',
      });

    token = res.body.token;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/parking/park', () => {
    it('should park a car successfully with a valid license plate', async () => {
      const mockResult = { slot: 1, licensePlate: 'ABC123' };
      parkingService.parkCar.mockReturnValue(mockResult);

      const res = await request(app)
        .post('/api/parking/park')
        .set('Authorization', `Bearer ${token}`)
        .send({
          licensePlate: 'ABC123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockResult);
      expect(parkingService.parkCar).toHaveBeenCalledWith('ABC123');
    });

    it('should fail to park a car without providing a license plate', async () => {
      const res = await request(app)
        .post('/api/parking/park')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'License plate is required');
      expect(parkingService.parkCar).not.toHaveBeenCalled();
    });

    it('should handle errors from parkingService.parkCar', async () => {
      parkingService.parkCar.mockImplementation(() => {
        throw new Error('Parking lot is full');
      });

      const res = await request(app)
        .post('/api/parking/park')
        .set('Authorization', `Bearer ${token}`)
        .send({
          licensePlate: 'ABC123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Parking lot is full');
      expect(parkingService.parkCar).toHaveBeenCalledWith('ABC123');
    });
  });

  describe('GET /api/parking/slot/:slot', () => {
    it('should retrieve slot information successfully with a valid slot number', async () => {
      const mockSlotInfo = { slot: 1, licensePlate: 'ABC123', status: 'occupied' };
      parkingService.getSlotInfo.mockReturnValue(mockSlotInfo);

      const res = await request(app)
        .get('/api/parking/slot/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockSlotInfo);
      expect(parkingService.getSlotInfo).toHaveBeenCalledWith(1);
    });

    it('should fail to retrieve slot information with an invalid slot number', async () => {
      const res = await request(app)
        .get('/api/parking/slot/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid slot number');
      expect(parkingService.getSlotInfo).not.toHaveBeenCalled();
    });

    it('should handle errors from parkingService.getSlotInfo', async () => {
      parkingService.getSlotInfo.mockImplementation(() => {
        throw new Error('Slot not found');
      });

      const res = await request(app)
        .get('/api/parking/slot/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Slot not found');
      expect(parkingService.getSlotInfo).toHaveBeenCalledWith(999);
    });
  });

  describe('POST /api/parking/unpark', () => {
    it('should unpark a car successfully with a valid license plate', async () => {
      const mockResult = { message: 'Car unparked successfully', slot: 1 };
      parkingService.unparkCar.mockReturnValue(mockResult);

      const res = await request(app)
        .post('/api/parking/unpark')
        .set('Authorization', `Bearer ${token}`)
        .send({
          licensePlate: 'ABC123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockResult);
      expect(parkingService.unparkCar).toHaveBeenCalledWith('ABC123');
    });

    it('should fail to unpark a car without providing a license plate', async () => {
      const res = await request(app)
        .post('/api/parking/unpark')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'License plate is required');
      expect(parkingService.unparkCar).not.toHaveBeenCalled();
    });

  });

});
