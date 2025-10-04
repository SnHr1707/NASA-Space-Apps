// src/utils/prediction.js
import { sharkZones } from '../data/sharkZones';

// --- MODEL CONFIGURATION PARAMETERS ---
const CHLOROPHYLL_IDEAL_THRESHOLD = 5; // mg/m^3 - minimum value for a productive area
const SST_IDEAL_RANGE = { min: 18, max: 28 }; // degrees Celsius - ideal temperature range
const PROXIMITY_TIERS_KM = {
    critical: 150, //
    strong: 400,
    moderate: 800,
};

/**
 * Calculates the distance between two lat/lng points in kilometers using the Haversine formula.
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number} The distance in kilometers.
 */
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Finds the nearest shark zone and the distance to it.
 * @param {number} lat The latitude of the selected point.
 * @param {number} lon The longitude of the selected point.
 * @returns {object} An object containing the nearest zone and the distance.
 */
function findNearestSharkZone(lat, lon) {
    let minDistance = Infinity;
    let nearestZone = null;

    for (const zone of sharkZones) {
        const [zoneLon, zoneLat] = zone.coords;
        const distance = getDistance(lat, lon, zoneLat, zoneLon);
        if (distance < minDistance) {
            minDistance = distance;
            nearestZone = zone;
        }
    }
    return { distance: minDistance, zone: nearestZone };
}

/**
 * Simulates running a prediction model based on environmental data and proximity to known habitats.
 * In a real application, the simulated data would be replaced with fetched data from a service like NASA's Harmony API.
 * @param {object} marker - The selected location with { latitude, longitude }.
 * @returns {Promise<object>} A promise that resolves with the prediction results.
 */
export function runPrediction(marker) {
    return new Promise((resolve) => {
        // Simulate network delay and computation for a better user experience.
        setTimeout(() => {
            // --- DATA SIMULATION ---
            // TODO: Replace these simulated values with real data fetched from a NASA API.
            const simulatedChlorophyll = Math.random() * 20; // Simulate 0 to 20 mg/m^3
            const simulatedSST = 10 + Math.random() * 20; // Simulate 10 to 30 °C

            // --- MODEL LOGIC EVALUATION ---
            const isChlorophyllGood = simulatedChlorophyll > CHLOROPHYLL_IDEAL_THRESHOLD;
            const isSSTGood = simulatedSST >= SST_IDEAL_RANGE.min && simulatedSST <= SST_IDEAL_RANGE.max;
            const { distance: distanceToZone, zone: nearestZone } = findNearestSharkZone(marker.latitude, marker.longitude);

            let conditionsScore = 0;
            if (isChlorophyllGood) conditionsScore += 35;
            if (isSSTGood) conditionsScore += 35;

            let proximityBonus = 0;
            if (distanceToZone <= PROXIMITY_TIERS_KM.critical) {
                proximityBonus = 40;
            } else if (distanceToZone <= PROXIMITY_TIERS_KM.strong) {
                proximityBonus = 25;
            } else if (distanceToZone <= PROXIMITY_TIERS_KM.moderate) {
                proximityBonus = 10;
            }

            let message = "";
            let baseProbability = conditionsScore + proximityBonus + (Math.random() * 5); // Add slight randomness

            if (baseProbability > 75) {
                message = `High probability. This area shows favorable conditions and is located near the ${nearestZone.name}, a known habitat for ${nearestZone.species}.`;
            } else if (baseProbability > 40) {
                message = `Moderate probability. Conditions may be suitable or the location is reasonably close to the ${nearestZone.name}.`;
            } else {
                message = `Low probability. The sea surface temperature or chlorophyll levels are not ideal, and it's distant from known foraging grounds like the ${nearestZone.name}.`;
            }
            
            // If conditions are poor but it's very close to a hotspot, override the message.
            if (conditionsScore < 30 && proximityBonus >= 25) {
                message = `Conditions are not ideal, but this location is very close (${Math.round(distanceToZone)} km) to the ${nearestZone.name}. Shark activity is still possible.`
            }

            // Ensure probability is capped between 5% and 99%.
            const finalProbability = Math.min(Math.max(Math.round(baseProbability), 5), 99);

            resolve({
                probability: finalProbability,
                message,
                data: {
                    chlorophyll: simulatedChlorophyll.toFixed(2),
                    sst: simulatedSST.toFixed(2),
                    distanceToZone: distanceToZone.toFixed(0),
                    nearestZoneName: nearestZone.name,
                }
            });
        }, 2500); // 2.5 second delay
    });
}