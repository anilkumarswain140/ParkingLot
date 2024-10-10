class ParkingService {
    constructor(size) {
      this.size = size;
      this.slots = new Array(size).fill(null); // Initialize slots as empty
    }
  
    parkCar(licensePlate) {
      const emptySlot = this.slots.findIndex(slot => slot === null);
      if (emptySlot === -1) {
        throw new Error('Parking lot is full');
      }
      this.slots[emptySlot] = licensePlate;
      return { licensePlate, slot: emptySlot + 1 };
    }
  
    getSlotInfo(slotNumber) {
      if (slotNumber < 1 || slotNumber > this.size) {
        throw new Error('Invalid slot number');
      }
      const car = this.slots[slotNumber - 1];
      return {
        slot: slotNumber,
        isEmpty: car === null,
        licensePlate: car,
      };
    }
  
    unparkCar(licensePlate) {
      const slotIndex = this.slots.findIndex(slot => slot === licensePlate);
      if (slotIndex === -1) {
        throw new Error('Car not found');
      }
      this.slots[slotIndex] = null;
      return { licensePlate, slot: slotIndex + 1 };
    }
  }
  
  const parkingLotSize = parseInt(process.env.PARKING_LOT_SIZE, 10) || 5;
  const parkingService = new ParkingService(parkingLotSize);
  
  module.exports = parkingService;
  