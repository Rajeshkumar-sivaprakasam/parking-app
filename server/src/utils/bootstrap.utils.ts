import Slot from "../models/slot.model";

export const initializeParkingSlots = async () => {
  try {
    const sections = [
      { prefix: "A", count: 20, type: "standard", price: 5 },
      { prefix: "B", count: 10, type: "ev", price: 8 },
      { prefix: "C", count: 10, type: "disabled", price: 4 },
    ];

    const slotsToCreate = [];

    // Get all existing slot numbers
    const existingSlots = await Slot.find({}, "number");
    const existingSlotNumbers = new Set(existingSlots.map((s) => s.number));

    for (const section of sections) {
      for (let i = 1; i <= section.count; i++) {
        const slotNumber = `${section.prefix}${i}`;

        if (!existingSlotNumbers.has(slotNumber)) {
          slotsToCreate.push({
            number: slotNumber,
            status: "available",
            type: section.type,
            pricePerHour: section.price,
            location: "Level 1",
          });
        }
      }
    }

    if (slotsToCreate.length > 0) {
      await Slot.insertMany(slotsToCreate);
      console.log(`Initialized ${slotsToCreate.length} new parking slots.`);
    } else {
      console.log("All default parking slots already exist.");
    }
  } catch (error) {
    console.error("Error initializing parking slots:", error);
  }
};
