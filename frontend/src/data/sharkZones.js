// src/data/sharkZones.js

// This file contains static data for known shark congregation areas or "hotspots."
// The model uses these locations to calculate proximity, which significantly influences the prediction probability.
// Format: { name: string, species: string, coords: [longitude, latitude] }

export const sharkZones = [
  { name: "Great Barrier Reef, Australia", species: "Reef sharks, hammerheads, tiger sharks", coords: [147.6992, -18.2871] },
  { name: "Bahamas (Shark Alley & Bimini)", species: "Caribbean reef, tiger, lemon sharks", coords: [-77.3963, 25.0343] },
  { name: "Cape Town / False Bay, South Africa", species: "Great white sharks", coords: [18.4740, -34.3568] },
  { name: "Galápagos Islands, Ecuador", species: "Hammerhead, white-tip, reef sharks", coords: [-90.9656, -0.9538] },
  { name: "Florida Keys, USA", species: "Nurse, blacktip, lemon sharks", coords: [-81.7800, 24.5551] },
  { name: "Coral Triangle (Indonesia/Philippines)", species: "Reef sharks, hammerheads", coords: [127.3212, 0.7893] },
  { name: "Ningaloo Reef, Northwest Australia", species: "Whale sharks, tiger sharks", coords: [114.1484, -21.8405] },
  { name: "Mozambique Channel, Indian Ocean", species: "Tiger sharks, bull sharks", coords: [41.5000, -16.5000] },
  { name: "Azores, North Atlantic Ocean", species: "Blue sharks, mako sharks", coords: [-27.2269, 38.7121] },
  { name: "South Australian Basin, Southern Ocean", species: "Great white sharks", coords: [138.0000, -34.0000] }
];