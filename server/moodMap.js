// Simple mapping of mood to genres / seeds
const moodMap = {
  happy: { genres: ['pop','dance'], target_valence: 0.9 },
  sad: { genres: ['acoustic','singer-songwriter'], target_valence: 0.2 },
  chill: { genres: ['chill','lofi'], target_energy: 0.2 },
  energetic: { genres: ['edm','rock'], target_energy: 0.9 },
  romantic: { genres: ['rnb','soul'], target_valence: 0.7 }
};

module.exports = moodMap;
