import axios from "axios";

/**
 * Fetches textual location information using latitude & longitude.
 * @param {Object} locationInfo - Object with coordinates: [longitude, latitude]
 * @param {number} limit - Number of results to return
 * @returns {Promise<Object>} Modified location data
 */

const getTextLocationOfUser = async (locationInfo, limit = 1) => {
  const [longitude, latitude] = locationInfo.coordinates;
  const url = `${process.env.NEXT_PUBLIC_GEOLOCATION_API_URL}?lat=${latitude}&lon=${longitude}&limit=${limit}&appid=${process.env.NEXT_PUBLIC_GEOLOCATION_API_KEY}`;
  const { data } = await axios.get(url);
  const firstResult = Array.isArray(data) ? data[0] : data;

  return {
    name: firstResult.name,
    local_names: {
      en: firstResult.local_names?.en || null,
      ascii: firstResult.local_names?.ascii || null,
      feature: firstResult.local_names?.feature_name || null,
    },
    state: firstResult.state,
    country: firstResult.country,
  };
};

/**
 * Gets user's permission-based location and resolves with full location object
 * @returns {Promise<Object>} Full location info with coordinates and text
 */
export const getUserLocationInfoByPermission = async () => {
  if (!navigator.geolocation) throw new Error("Geolocation API is not supported by this browser...");

  // Wrap the geolocation API in a Promise
  const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
  const { latitude, longitude } = position.coords; // destructuring syntax...
  const locationInfo = {
    coordinates: [longitude, latitude],
  };

  try {
    const addressText = await getTextLocationOfUser(locationInfo);
    return {
      ...locationInfo,
      addressText,
    };
  } catch (error) {
    console.error("Error fetching textual location data:", error);
    return { ...locationInfo, addressText: null };
  }
};
