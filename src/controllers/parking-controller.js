const parkingService = require('../services/parking-service');

const park = (req, res, next) => {
  try {
    const { licensePlate } = req.body;
    if (!licensePlate) {
      return res.status(400).json({ message: 'License plate is required' });
    }
    const result = parkingService.parkCar(licensePlate);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSlot = (req, res, next) => {
  try {
    const slotNumber = parseInt(req.params.slot, 10);
    if (isNaN(slotNumber)) {
      return res.status(400).json({ message: 'Invalid slot number' });
    }
    const slotInfo = parkingService.getSlotInfo(slotNumber);
    res.status(200).json(slotInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const unpark = (req, res, next) => {
  try {
    const { licensePlate } = req.body;
    if (!licensePlate) {
      return res.status(400).json({ message: 'License plate is required' });
    }
    const result = parkingService.unparkCar(licensePlate);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { park, getSlot, unpark };
