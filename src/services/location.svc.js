// locationUtils.js

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const BIGDATACLOUD_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const IPWHO_URL = 'https://ipwho.is/';

const formatAddress = (address) => {
  if (!address) return '';
  const components = [
    address.road,
    address.suburb || address.neighbourhood,
    address.city || address.town || address.village,
    address.state,
    address.postcode,
    address.country
  ].filter(Boolean);
  return components.slice(0, 3).join(', ');
};

const calculateConfidence = (item) => {
  let score = 0;
  if (item.importance) score += parseFloat(item.importance);
  const addressFields = ['road', 'suburb', 'city', 'town', 'state', 'postcode', 'country'];
  const completeness = addressFields.reduce((acc, field) => acc + (item.address?.[field] ? 1 : 0), 0) / addressFields.length;
  score += completeness;
  return score / 2;
};


export const reverseGeocode = async (latitude, longitude) => {
  try {
    const [nominatimRes, bigDataCloudRes] = await Promise.all([
      fetch(`${NOMINATIM_URL}?${new URLSearchParams({
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 18,
        addressdetails: 1
      })}`),
      fetch(`${BIGDATACLOUD_URL}?${new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        localityLanguage: 'en'
      })}`)
    ]);

    const [nominatimData, bigDataCloudData] = await Promise.all([
      nominatimRes.json(),
      bigDataCloudRes.json()
    ]);

    if (nominatimData?.address) {
      const formatted = formatAddress(nominatimData.address);
      if (formatted) return formatted;
    }

    if (bigDataCloudData?.locality || bigDataCloudData?.principalSubdivision) {
      const parts = [
        bigDataCloudData.locality,
        bigDataCloudData.city,
        bigDataCloudData.principalSubdivision,
        bigDataCloudData.countryName
      ].filter(Boolean);
      return parts.slice(0, 3).join(', ');
    }

    return null;
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return null;
  }
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        resolve({ latitude, longitude, accuracy, method: 'gps' });
      },
      () => {
        fallbackToIP().then(resolve).catch(reject);
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 0
      }
    );
  });
};

const fallbackToIP = async () => {
  try {
    const res = await fetch(IPWHO_URL);
    const data = await res.json();

    if (!data.success) throw new Error('IP-based location failed');
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy || 10000,
      method: 'ip'
    };
  } catch (err) {
    console.error('Fallback to IP failed:', err);
    throw err;
  }
};

export const getSmartLocation = async () => {
  try {
    const { latitude, longitude, accuracy, method } = await getCurrentLocation();
    const address = await reverseGeocode(latitude, longitude);
    return {
      latitude,
      longitude,
      accuracy,
      method,
      address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    };
  } catch (err) {
    return {
      latitude: 0,
      longitude: 0,
      accuracy: Infinity,
      method: 'unknown',
      address: 'Unable to determine location'
    };
  }
};

export const searchLocations = async (searchText) => {
  if (!searchText.trim() || searchText.length < 3) return [];

  const tryPhoton = async () => {
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchText)}&lang=en`);
    const data = await res.json();
    if (!data.features.length) return null;

    return data.features.map(item => {
      const props = item.properties;
      return {
        display_name: [props.name, props.city, props.state, props.country].filter(Boolean).join(', '),
        full_name: props.name,
        lat: item.geometry.coordinates[1],
        lon: item.geometry.coordinates[0],
        confidence: 1
      };
    });
  };

  const tryNominatim = async () => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: searchText,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        countrycodes: 'in'
      })
    );
    const data = await res.json();
    return data.map(item => ({
      display_name: formatAddress(item.address),
      full_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      confidence: calculateConfidence(item)
    }));
  };

  try {
    const photonResults = await tryPhoton();
    if (photonResults && photonResults.length > 0) return photonResults;

    return await tryNominatim();
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
};

export const getLocationName = async (latitude, longitude) => {
  try {
    const [nominatimResponse, bigDataCloudResponse] = await Promise.all([
      fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        new URLSearchParams({
          format: 'json',
          lat: latitude,
          lon: longitude,
          zoom: 10,
          addressdetails: 1
        })
      ),
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?` +
        new URLSearchParams({
          latitude: latitude,
          longitude: longitude,
          localityLanguage: 'en'
        })
      )
    ]);

    const [nominatimData, bigDataCloudData] = await Promise.all([
      nominatimResponse.json(),
      bigDataCloudResponse.json()
    ]);

    // First try from Nominatim
    const nominatimCity =
      nominatimData?.address?.city ||
      nominatimData?.address?.town ||
      nominatimData?.address?.village;

    if (nominatimCity) {
      return { name: nominatimCity, isCityName: true };
    }

    // Try from BigDataCloud
    const bigDataCity = bigDataCloudData?.locality || bigDataCloudData?.city;
    if (bigDataCity) {
      return { name: bigDataCity, isCityName: true };
    }

    // Fallback to state or region
    const fallbackState =
      nominatimData?.address?.state ||
      bigDataCloudData?.principalSubdivision;

    if (fallbackState) {
      return { name: fallbackState, isCityName: false };
    }

    throw new Error('No valid location info found');
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return {
      name: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      isCityName: false
    };
  }
};
