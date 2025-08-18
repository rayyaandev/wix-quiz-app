// =========================
// GOOGLE PLACES API CONFIGURATION
// =========================

const config = {
  // Replace with your actual Google Places API key
  googleApiKey: "AIzaSyDHZOStkwzSDAENgOt_Wx_tYb2EV3PZilY",

  // Google Places API settings
  googlePlaces: {
    // Enable/disable autocomplete features
    enableAutocomplete: true,

    // Default autocomplete types
    defaultTypes: {
      country: "country",
      stateRegion: "administrative_area_level_1",
      city: "locality",
    },
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = config;
}
