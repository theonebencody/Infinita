// ═══════════════════════════════════════════════════════════════════════════
// LAUNCH DATABASE — Data layer & paginated query API
// Based on: public/space-website-design-guide.md, Section 5.1
// ═══════════════════════════════════════════════════════════════════════════

// ── Schema / field definitions ────────────────────────────────────────────

/**
 * @typedef {Object} LaunchRecord
 * @property {string}  id                      - Unique identifier (slug)
 * @property {string}  mission_name            - Mission name / designation
 * @property {string}  launch_date             - ISO date string (YYYY-MM-DD)
 * @property {string}  rocket_name             - Rocket family name
 * @property {string}  rocket_variant          - Specific variant (e.g. "Block 5", "v1.1")
 * @property {string}  provider                - Launch provider / organization
 * @property {'success'|'failure'|'partial'|'anomaly'} outcome
 * @property {string}  orbit_type              - Target orbit (LEO, GTO, MEO, SSO, ISS, TLI, interplanetary, etc.)
 * @property {string}  launch_site             - Launch site name
 * @property {number}  launch_site_lat         - Launch site latitude
 * @property {number}  launch_site_lon         - Launch site longitude
 * @property {string}  payload_type            - Payload category (satellite, crewed, cargo, science, comms, navigation, etc.)
 * @property {number|null} payload_mass_kg     - Payload mass in kilograms
 * @property {string}  mission_description     - Short description of the mission
 * @property {string|null} mission_patch_url   - URL to mission patch image
 * @property {string|null} booster_landing_outcome - "success", "failure", "expended", "ocean", null
 * @property {string[]} firsts                 - Array of historical firsts achieved
 * @property {string|null} video               - YouTube video ID
 */

export const OUTCOME = Object.freeze({
  SUCCESS: 'success',
  FAILURE: 'failure',
  PARTIAL: 'partial',
  ANOMALY: 'anomaly',
});

export const ORBIT_TYPES = Object.freeze([
  'LEO', 'MEO', 'GTO', 'GEO', 'SSO', 'ISS', 'TLI', 'HEO',
  'Mars', 'Moon', 'interplanetary', 'suborbital',
]);

export const PAYLOAD_TYPES = Object.freeze([
  'satellite', 'comms', 'navigation', 'earth-observation', 'weather',
  'crewed', 'cargo', 'science', 'technology-demo', 'reconnaissance',
  'space-station', 'lunar-lander', 'rover', 'rideshare',
]);

// ── Seed data — 60 realistic launch records ──────────────────────────────

/** @type {LaunchRecord[]} */
export const SEED_DATA = [
  { id: 'f9-starlink-6-38', mission_name: 'Starlink Group 6-38', launch_date: '2024-01-02', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Cape Canaveral SLC-40', launch_site_lat: 28.56, launch_site_lon: -80.58, payload_type: 'comms', payload_mass_kg: 17400, mission_description: 'Batch deployment of 23 Starlink v2 Mini satellites to low Earth orbit for SpaceX\'s broadband constellation.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'f9-ovzon3', mission_name: 'Ovzon 3', launch_date: '2024-01-03', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'GTO', launch_site: 'Cape Canaveral SLC-40', launch_site_lat: 28.56, launch_site_lon: -80.58, payload_type: 'comms', payload_mass_kg: 4000, mission_description: 'Geostationary communications satellite for Swedish company Ovzon providing mobile broadband.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'vulcan-cert1', mission_name: 'Vulcan Cert-1 / Peregrine', launch_date: '2024-01-08', rocket_name: 'Vulcan Centaur', rocket_variant: 'VC2S', provider: 'ULA', outcome: 'success', orbit_type: 'TLI', launch_site: 'Cape Canaveral SLC-41', launch_site_lat: 28.58, launch_site_lon: -80.58, payload_type: 'lunar-lander', payload_mass_kg: 1283, mission_description: 'Maiden flight of ULA\'s Vulcan Centaur rocket carrying Astrobotic\'s Peregrine lunar lander. The rocket performed flawlessly, though the lander experienced a propellant leak.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First Vulcan Centaur launch'], video: null },
  { id: 'f9-starlink-6-39', mission_name: 'Starlink Group 6-39', launch_date: '2024-01-10', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Vandenberg SLC-4E', launch_site_lat: 34.63, launch_site_lon: -120.63, payload_type: 'comms', payload_mass_kg: 17400, mission_description: 'Deployment of 22 Starlink v2 Mini satellites to polar orbit from Vandenberg.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'electron-four-of-a-kind', mission_name: 'Four Of A Kind', launch_date: '2024-01-31', rocket_name: 'Electron', rocket_variant: 'KS', provider: 'Rocket Lab', outcome: 'success', orbit_type: 'LEO', launch_site: 'Mahia LC-1', launch_site_lat: -39.26, launch_site_lon: 177.86, payload_type: 'earth-observation', payload_mass_kg: 80, mission_description: 'Dedicated mission deploying four Earth observation satellites for Spire Global.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'f9-crew-8', mission_name: 'Crew-8', launch_date: '2024-03-04', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'ISS', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'crewed', payload_mass_kg: 12055, mission_description: 'NASA\'s eighth operational Crew Dragon mission to the ISS carrying four astronauts for a long-duration stay.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'h3-tf2', mission_name: 'H3 Test Flight 2', launch_date: '2024-02-17', rocket_name: 'H3', rocket_variant: 'H3-22S', provider: 'JAXA', outcome: 'success', orbit_type: 'LEO', launch_site: 'Tanegashima', launch_site_lat: 30.4, launch_site_lon: 131.0, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'Second test flight of Japan\'s H3 rocket after the first flight\'s failure. The rocket successfully reached orbit, validating the new launch system.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First successful H3 launch'], video: null },
  { id: 'f9-transporter-10', mission_name: 'Transporter-10', launch_date: '2024-03-04', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'SSO', launch_site: 'Vandenberg SLC-4E', launch_site_lat: 34.63, launch_site_lon: -120.63, payload_type: 'rideshare', payload_mass_kg: 5000, mission_description: 'SmallSat rideshare mission carrying 53 payloads to Sun-synchronous orbit for a variety of commercial and government customers.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'ariane6-maiden', mission_name: 'Ariane 6 Maiden Flight', launch_date: '2024-07-09', rocket_name: 'Ariane 6', rocket_variant: 'A62', provider: 'ESA', outcome: 'partial', orbit_type: 'LEO', launch_site: 'Kourou ELA-4', launch_site_lat: 5.24, launch_site_lon: -52.77, payload_type: 'technology-demo', payload_mass_kg: 1500, mission_description: 'Inaugural flight of Europe\'s Ariane 6 rocket. The first burn performed nominally, but the upper stage APU failed to restart for the deorbit burn, leaving debris in orbit.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First Ariane 6 launch'], video: null },
  { id: 'starship-ift3', mission_name: 'Starship IFT-3', launch_date: '2024-03-14', rocket_name: 'Starship', rocket_variant: 'Super Heavy', provider: 'SpaceX', outcome: 'partial', orbit_type: 'suborbital', launch_site: 'Boca Chica Starbase', launch_site_lat: 25.99, launch_site_lon: -97.16, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'Third integrated flight test of SpaceX Starship. Achieved stage separation, payload bay door opening, and propellant transfer demo, but lost both vehicles during reentry.', mission_patch_url: null, booster_landing_outcome: 'failure', firsts: ['First Starship payload door opening in space'], video: null },
  { id: 'starship-ift4', mission_name: 'Starship IFT-4', launch_date: '2024-06-06', rocket_name: 'Starship', rocket_variant: 'Super Heavy', provider: 'SpaceX', outcome: 'success', orbit_type: 'suborbital', launch_site: 'Boca Chica Starbase', launch_site_lat: 25.99, launch_site_lon: -97.16, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'Fourth integrated flight test. Both Super Heavy booster and Starship ship achieved controlled ocean splashdowns for the first time.', mission_patch_url: null, booster_landing_outcome: 'ocean', firsts: ['First controlled Starship splashdown', 'First controlled Super Heavy splashdown'], video: null },
  { id: 'starship-ift5', mission_name: 'Starship IFT-5', launch_date: '2024-10-13', rocket_name: 'Starship', rocket_variant: 'Super Heavy', provider: 'SpaceX', outcome: 'success', orbit_type: 'suborbital', launch_site: 'Boca Chica Starbase', launch_site_lat: 25.99, launch_site_lon: -97.16, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'First catch of a Super Heavy booster by the launch tower "chopstick" arms. Starship completed a controlled splashdown in the Indian Ocean.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First orbital-class booster caught at launch tower'], video: null },
  { id: 'polaris-dawn', mission_name: 'Polaris Dawn', launch_date: '2024-09-10', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'HEO', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'crewed', payload_mass_kg: 12055, mission_description: 'Privately funded mission reaching the highest Earth orbit since Gemini. Crew performed the first commercial spacewalk using SpaceX EVA suits.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First commercial spacewalk', 'Highest Earth orbit since Gemini'], video: null },
  { id: 'chang-zheng-5-tiandu', mission_name: 'Chang Zheng 5 / Queqiao-2', launch_date: '2024-03-20', rocket_name: 'Chang Zheng 5', rocket_variant: 'CZ-5', provider: 'CNSA', outcome: 'success', orbit_type: 'TLI', launch_site: 'Wenchang', launch_site_lat: 19.61, launch_site_lon: 110.95, payload_type: 'comms', payload_mass_kg: 1200, mission_description: 'Lunar relay satellite positioned in a halo orbit around the Earth-Moon L2 point to support the Chang\'e-6 sample return mission.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'change6', mission_name: 'Chang\'e-6', launch_date: '2024-05-03', rocket_name: 'Chang Zheng 5', rocket_variant: 'CZ-5', provider: 'CNSA', outcome: 'success', orbit_type: 'TLI', launch_site: 'Wenchang', launch_site_lat: 19.61, launch_site_lon: 110.95, payload_type: 'science', payload_mass_kg: 8200, mission_description: 'First mission to collect and return samples from the far side of the Moon, landing in the Apollo crater within the South Pole-Aitken basin.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First far-side lunar sample return'], video: null },
  { id: 'pslv-c58', mission_name: 'PSLV-C58 / XPoSat', launch_date: '2024-01-01', rocket_name: 'PSLV', rocket_variant: 'PSLV-DL', provider: 'ISRO', outcome: 'success', orbit_type: 'LEO', launch_site: 'Satish Dhawan SDSC', launch_site_lat: 13.73, launch_site_lon: 80.23, payload_type: 'science', payload_mass_kg: 469, mission_description: 'India\'s X-ray Polarimetry Satellite, the second dedicated X-ray polarimetry mission after NASA\'s IXPE.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First Indian X-ray polarimetry satellite'], video: null },
  { id: 'soyuz-ms26', mission_name: 'Soyuz MS-26', launch_date: '2024-09-11', rocket_name: 'Soyuz', rocket_variant: 'Soyuz-2.1a', provider: 'Roscosmos', outcome: 'success', orbit_type: 'ISS', launch_site: 'Baikonur', launch_site_lat: 45.92, launch_site_lon: 63.34, payload_type: 'crewed', payload_mass_kg: 7220, mission_description: 'ISS crew rotation mission carrying three crew members for Expedition 72.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'electron-changes-in-latitudes', mission_name: 'Changes In Latitudes, Changes In Attitudes', launch_date: '2024-02-18', rocket_name: 'Electron', rocket_variant: 'KS', provider: 'Rocket Lab', outcome: 'success', orbit_type: 'LEO', launch_site: 'Mahia LC-1', launch_site_lat: -39.26, launch_site_lon: 177.86, payload_type: 'earth-observation', payload_mass_kg: 85, mission_description: 'Dedicated launch for Synspective\'s StriX-3 SAR Earth observation satellite.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'f9-crs-30', mission_name: 'CRS-30 (SpX-30)', launch_date: '2024-03-21', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'ISS', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'cargo', payload_mass_kg: 6000, mission_description: 'Commercial Resupply Services mission delivering science experiments and supplies to the International Space Station.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'vega-c-return', mission_name: 'Vega-C VV25 / Sentinel-1C', launch_date: '2024-12-05', rocket_name: 'Vega-C', rocket_variant: 'Vega-C', provider: 'ESA', outcome: 'success', orbit_type: 'SSO', launch_site: 'Kourou ELV', launch_site_lat: 5.24, launch_site_lon: -52.77, payload_type: 'earth-observation', payload_mass_kg: 2300, mission_description: 'Return-to-flight mission for Vega-C after 2022 failure, carrying Copernicus Sentinel-1C radar imaging satellite.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First Vega-C success after anomaly'], video: null },
  { id: 'f9-euclid', mission_name: 'Euclid', launch_date: '2023-07-01', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'interplanetary', launch_site: 'Cape Canaveral SLC-40', launch_site_lat: 28.56, launch_site_lon: -80.58, payload_type: 'science', payload_mass_kg: 2160, mission_description: 'ESA\'s space telescope designed to map the geometry of the dark universe by observing billions of galaxies across 10 billion light-years.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'fh-psyche', mission_name: 'Psyche', launch_date: '2023-10-13', rocket_name: 'Falcon Heavy', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'interplanetary', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'science', payload_mass_kg: 2608, mission_description: 'NASA mission to the metal-rich asteroid 16 Psyche, which may be the exposed core of a protoplanet. Spacecraft is expected to arrive in 2029.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'chandrayaan3', mission_name: 'Chandrayaan-3', launch_date: '2023-07-14', rocket_name: 'LVM3', rocket_variant: 'LVM3-M4', provider: 'ISRO', outcome: 'success', orbit_type: 'TLI', launch_site: 'Satish Dhawan SDSC', launch_site_lat: 13.73, launch_site_lon: 80.23, payload_type: 'lunar-lander', payload_mass_kg: 3900, mission_description: 'India\'s successful lunar landing mission. The Vikram lander touched down near the south pole, making India the fourth nation to soft-land on the Moon.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First landing near lunar south pole', 'India\'s first successful Moon landing'], video: null },
  { id: 'starship-ift1', mission_name: 'Starship IFT-1', launch_date: '2023-04-20', rocket_name: 'Starship', rocket_variant: 'Super Heavy', provider: 'SpaceX', outcome: 'failure', orbit_type: 'suborbital', launch_site: 'Boca Chica Starbase', launch_site_lat: 25.99, launch_site_lon: -97.16, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'First integrated flight test of Starship. Several Raptor engines failed during ascent, and the vehicle tumbled after stage separation failed. Flight Termination System was activated.', mission_patch_url: null, booster_landing_outcome: 'failure', firsts: ['First full Starship integrated flight test'], video: null },
  { id: 'starship-ift2', mission_name: 'Starship IFT-2', launch_date: '2023-11-18', rocket_name: 'Starship', rocket_variant: 'Super Heavy', provider: 'SpaceX', outcome: 'partial', orbit_type: 'suborbital', launch_site: 'Boca Chica Starbase', launch_site_lat: 25.99, launch_site_lon: -97.16, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'Second integrated flight test. Successfully demonstrated hot-staging separation. Super Heavy exploded after separation; Starship reached 148 km altitude before FTS activation.', mission_patch_url: null, booster_landing_outcome: 'failure', firsts: ['First successful Starship hot-staging'], video: null },
  { id: 'jwst', mission_name: 'James Webb Space Telescope', launch_date: '2021-12-25', rocket_name: 'Ariane 5', rocket_variant: 'ECA', provider: 'ESA', outcome: 'success', orbit_type: 'interplanetary', launch_site: 'Kourou ELA-3', launch_site_lat: 5.24, launch_site_lon: -52.77, payload_type: 'science', payload_mass_kg: 6161, mission_description: 'The most powerful space telescope ever built, designed to see the first galaxies forming in the early universe. Deployed to the Sun-Earth L2 point, 1.5 million km from Earth.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['Largest space telescope mirror (6.5m)', 'Most distant space telescope from Earth'], video: null },
  { id: 'crew-dragon-demo2', mission_name: 'Crew Dragon Demo-2', launch_date: '2020-05-30', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'ISS', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'crewed', payload_mass_kg: 12055, mission_description: 'First crewed orbital spaceflight by a commercial provider. Doug Hurley and Bob Behnken launched to the ISS, ending a 9-year gap in US crewed launch capability.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First crewed commercial orbital flight', 'First crewed launch from US soil since 2011'], video: null },
  { id: 'fh-demo', mission_name: 'Falcon Heavy Demo', launch_date: '2018-02-06', rocket_name: 'Falcon Heavy', rocket_variant: 'Block 3', provider: 'SpaceX', outcome: 'success', orbit_type: 'interplanetary', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'technology-demo', payload_mass_kg: 1305, mission_description: 'Maiden flight of Falcon Heavy carrying Elon Musk\'s Tesla Roadster toward Mars orbit. Both side boosters landed synchronously; the center core missed the drone ship.', mission_patch_url: null, booster_landing_outcome: 'partial', firsts: ['First Falcon Heavy flight', 'Most powerful operational rocket at launch'], video: null },
  { id: 'f9-first-landing', mission_name: 'Orbcomm OG2 Mission 2', launch_date: '2015-12-22', rocket_name: 'Falcon 9', rocket_variant: 'FT', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Cape Canaveral SLC-40', launch_site_lat: 28.56, launch_site_lon: -80.58, payload_type: 'comms', payload_mass_kg: 2034, mission_description: 'First successful landing of an orbital-class rocket booster. The Falcon 9 first stage landed at Landing Zone 1, proving reusable rocketry was viable.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First landing of an orbital-class booster'], video: null },
  { id: 'atlas5-starliner-oft2', mission_name: 'Starliner OFT-2', launch_date: '2022-05-19', rocket_name: 'Atlas V', rocket_variant: 'N22', provider: 'ULA', outcome: 'success', orbit_type: 'ISS', launch_site: 'Cape Canaveral SLC-41', launch_site_lat: 28.58, launch_site_lon: -80.58, payload_type: 'technology-demo', payload_mass_kg: 13000, mission_description: 'Uncrewed orbital flight test of Boeing\'s Starliner spacecraft to the ISS. Successfully docked and returned, clearing the path for crewed flights.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First successful Starliner ISS docking'], video: null },
  { id: 'atlas5-starliner-cft', mission_name: 'Starliner CFT', launch_date: '2024-06-05', rocket_name: 'Atlas V', rocket_variant: 'N22', provider: 'ULA', outcome: 'anomaly', orbit_type: 'ISS', launch_site: 'Cape Canaveral SLC-41', launch_site_lat: 28.58, launch_site_lon: -80.58, payload_type: 'crewed', payload_mass_kg: 13000, mission_description: 'First crewed flight of Boeing\'s Starliner with Butch Wilmore and Suni Williams. Thruster issues and helium leaks prevented the crew from returning on Starliner; they were extended to an 8-month ISS stay.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First crewed Starliner flight'], video: null },
  { id: 'artemis1', mission_name: 'Artemis I', launch_date: '2022-11-16', rocket_name: 'SLS', rocket_variant: 'Block 1', provider: 'NASA', outcome: 'success', orbit_type: 'TLI', launch_site: 'Kennedy Space Center LC-39B', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'technology-demo', payload_mass_kg: 26520, mission_description: 'Uncrewed test flight of the Space Launch System and Orion spacecraft around the Moon. Orion traveled farther from Earth than any spacecraft designed for humans.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First SLS launch', 'Farthest distance from Earth by a human-rated spacecraft'], video: null },
  { id: 'electron-still-testing', mission_name: 'Still Testing', launch_date: '2018-01-21', rocket_name: 'Electron', rocket_variant: 'KS', provider: 'Rocket Lab', outcome: 'success', orbit_type: 'LEO', launch_site: 'Mahia LC-1', launch_site_lat: -39.26, launch_site_lon: 177.86, payload_type: 'technology-demo', payload_mass_kg: 13, mission_description: 'Second Electron flight and first to reach orbit, deploying three small satellites. Made Rocket Lab the first private company to reach orbit from the southern hemisphere.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First orbital launch from New Zealand', 'First private orbital launch from southern hemisphere'], video: null },
  { id: 'new-glenn-ng1', mission_name: 'New Glenn NG-1', launch_date: '2025-01-13', rocket_name: 'New Glenn', rocket_variant: 'GS', provider: 'Blue Origin', outcome: 'partial', orbit_type: 'LEO', launch_site: 'Cape Canaveral LC-36', launch_site_lat: 28.47, launch_site_lon: -80.54, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'Maiden flight of Blue Origin\'s New Glenn heavy-lift rocket. The upper stage successfully reached orbit, but the first stage booster landing attempt failed.', mission_patch_url: null, booster_landing_outcome: 'failure', firsts: ['First New Glenn launch', 'First Blue Origin orbital launch'], video: null },
  { id: 'blue-ghost-m1', mission_name: 'Blue Ghost M1', launch_date: '2025-01-15', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'TLI', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'lunar-lander', payload_mass_kg: 600, mission_description: 'Firefly Aerospace\'s Blue Ghost lunar lander launched as a NASA CLPS mission. Successfully soft-landed on the Moon in Mare Crisium.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First commercial soft Moon landing (Blue Ghost)'], video: null },
  { id: 'f9-starlink-10-12', mission_name: 'Starlink Group 10-12', launch_date: '2025-03-01', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Cape Canaveral SLC-40', launch_site_lat: 28.56, launch_site_lon: -80.58, payload_type: 'comms', payload_mass_kg: 17400, mission_description: 'Deployment of 23 Starlink v2 Mini satellites with direct-to-cell capability.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'f9-starlink-10-14', mission_name: 'Starlink Group 10-14', launch_date: '2025-03-05', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Vandenberg SLC-4E', launch_site_lat: 34.63, launch_site_lon: -120.63, payload_type: 'comms', payload_mass_kg: 17400, mission_description: 'Polar orbit deployment of 23 Starlink v2 Mini satellites for global coverage.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'soyuz-ms27', mission_name: 'Soyuz MS-27', launch_date: '2025-03-14', rocket_name: 'Soyuz', rocket_variant: 'Soyuz-2.1a', provider: 'Roscosmos', outcome: 'success', orbit_type: 'ISS', launch_site: 'Baikonur', launch_site_lat: 45.92, launch_site_lon: 63.34, payload_type: 'crewed', payload_mass_kg: 7220, mission_description: 'ISS crew rotation mission carrying three crew members for Expedition 73.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'gslv-nisar', mission_name: 'GSLV-F15 / NISAR', launch_date: '2025-03-28', rocket_name: 'GSLV', rocket_variant: 'Mk II', provider: 'ISRO', outcome: 'success', orbit_type: 'SSO', launch_site: 'Satish Dhawan SDSC', launch_site_lat: 13.73, launch_site_lon: 80.23, payload_type: 'earth-observation', payload_mass_kg: 2800, mission_description: 'NASA-ISRO SAR satellite for measuring Earth surface changes with unprecedented precision. Joint mission between NASA and ISRO.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First NASA-ISRO joint satellite'], video: null },
  { id: 'f9-crew-10', mission_name: 'Crew-10', launch_date: '2025-03-14', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'ISS', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'crewed', payload_mass_kg: 12055, mission_description: 'Tenth operational Crew Dragon mission to the ISS, rotating the long-duration crew for Expedition 73.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'cz2c-einstein-probe', mission_name: 'Einstein Probe', launch_date: '2024-01-09', rocket_name: 'Chang Zheng 2C', rocket_variant: 'CZ-2C', provider: 'CNSA', outcome: 'success', orbit_type: 'LEO', launch_site: 'Xichang', launch_site_lat: 28.25, launch_site_lon: 102.03, payload_type: 'science', payload_mass_kg: 1450, mission_description: 'Chinese X-ray space telescope using lobster-eye optics to monitor the X-ray sky with high sensitivity and wide field of view.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First lobster-eye X-ray telescope in orbit'], video: null },
  { id: 'electron-owl-night-long', mission_name: 'Owl Night Long', launch_date: '2024-04-24', rocket_name: 'Electron', rocket_variant: 'KS', provider: 'Rocket Lab', outcome: 'success', orbit_type: 'LEO', launch_site: 'Mahia LC-1', launch_site_lat: -39.26, launch_site_lon: 177.86, payload_type: 'earth-observation', payload_mass_kg: 200, mission_description: 'Dedicated launch of a next-generation Earth observation satellite for an undisclosed commercial customer.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'f9-nrol-186', mission_name: 'NROL-186', launch_date: '2024-09-28', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Vandenberg SLC-4E', launch_site_lat: 34.63, launch_site_lon: -120.63, payload_type: 'reconnaissance', payload_mass_kg: null, mission_description: 'Classified National Reconnaissance Office payload launched to low Earth orbit.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'astra-lv0009', mission_name: 'LV0009', launch_date: '2022-06-12', rocket_name: 'Astra Rocket 3.3', rocket_variant: 'LV0009', provider: 'Astra', outcome: 'failure', orbit_type: 'LEO', launch_site: 'Cape Canaveral SLC-46', launch_site_lat: 28.46, launch_site_lon: -80.53, payload_type: 'satellite', payload_mass_kg: 25, mission_description: 'Failed to reach orbit due to an upper stage shutdown. The payload, NASA\'s TROPICS pathfinder cubesats, was lost.', mission_patch_url: null, booster_landing_outcome: null, firsts: [], video: null },
  { id: 'firefly-alpha-flta003', mission_name: 'Firefly Alpha FLTA003', launch_date: '2023-09-14', rocket_name: 'Firefly Alpha', rocket_variant: 'Alpha', provider: 'Firefly', outcome: 'failure', orbit_type: 'LEO', launch_site: 'Vandenberg SLC-2W', launch_site_lat: 34.75, launch_site_lon: -120.62, payload_type: 'technology-demo', payload_mass_kg: 35, mission_description: 'Third Alpha flight. Upper stage anomaly prevented reaching target orbit. Payloads reentered prematurely.', mission_patch_url: null, booster_landing_outcome: null, firsts: [], video: null },
  { id: 'relativity-terran1', mission_name: 'Terran 1 / GLHF', launch_date: '2023-03-22', rocket_name: 'Terran 1', rocket_variant: 'Terran 1', provider: 'Relativity', outcome: 'failure', orbit_type: 'LEO', launch_site: 'Cape Canaveral LC-16', launch_site_lat: 28.5, launch_site_lon: -80.56, payload_type: 'technology-demo', payload_mass_kg: 0, mission_description: 'First launch of the 3D-printed Terran 1 rocket. First stage performed well but upper stage failed to ignite. Proved the viability of 3D-printed rocket engines.', mission_patch_url: null, booster_landing_outcome: null, firsts: ['First 3D-printed rocket to attempt orbital flight'], video: null },
  { id: 'fh-ussf67', mission_name: 'USSF-67', launch_date: '2023-01-15', rocket_name: 'Falcon Heavy', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'GEO', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'reconnaissance', payload_mass_kg: 3750, mission_description: 'US Space Force mission deploying USSF-67 and LDPE-3A payloads to geostationary orbit.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'f9-axiom2', mission_name: 'Axiom Mission 2', launch_date: '2023-05-21', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'ISS', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'crewed', payload_mass_kg: 12055, mission_description: 'Second private astronaut mission to the ISS organized by Axiom Space. Crew spent 10 days aboard the station conducting research.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'electron-baby-come-back', mission_name: 'Baby Come Back', launch_date: '2022-05-02', rocket_name: 'Electron', rocket_variant: 'KS', provider: 'Rocket Lab', outcome: 'success', orbit_type: 'LEO', launch_site: 'Mahia LC-1', launch_site_lat: -39.26, launch_site_lon: 177.86, payload_type: 'earth-observation', payload_mass_kg: 150, mission_description: 'First Electron mission with a mid-air helicopter booster catch attempt. The helicopter briefly caught the booster before releasing it into the ocean.', mission_patch_url: null, booster_landing_outcome: 'partial', firsts: ['First mid-air helicopter catch of an orbital booster'], video: null },
  { id: 'cz5b-wentian', mission_name: 'Chang Zheng 5B / Wentian', launch_date: '2022-07-24', rocket_name: 'Chang Zheng 5B', rocket_variant: 'CZ-5B', provider: 'CNSA', outcome: 'success', orbit_type: 'LEO', launch_site: 'Wenchang', launch_site_lat: 19.61, launch_site_lon: 110.95, payload_type: 'space-station', payload_mass_kg: 23000, mission_description: 'Launch of the Wentian laboratory module, the second major component of the Chinese Space Station (Tiangong). Docked autonomously.', mission_patch_url: null, booster_landing_outcome: null, firsts: [], video: null },
  { id: 'cz5b-mengtian', mission_name: 'Chang Zheng 5B / Mengtian', launch_date: '2022-10-31', rocket_name: 'Chang Zheng 5B', rocket_variant: 'CZ-5B', provider: 'CNSA', outcome: 'success', orbit_type: 'LEO', launch_site: 'Wenchang', launch_site_lat: 19.61, launch_site_lon: 110.95, payload_type: 'space-station', payload_mass_kg: 23000, mission_description: 'Launch of the Mengtian experiment module, completing the three-module configuration of the Chinese Space Station.', mission_patch_url: null, booster_landing_outcome: null, firsts: ['Completion of Chinese Space Station core structure'], video: null },
  { id: 'sls-artemis1', mission_name: 'Artemis I (SLS)', launch_date: '2022-11-16', rocket_name: 'SLS', rocket_variant: 'Block 1', provider: 'NASA', outcome: 'success', orbit_type: 'TLI', launch_site: 'Kennedy Space Center LC-39B', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'science', payload_mass_kg: 26520, mission_description: 'Maiden flight of the Space Launch System. The uncrewed Orion spacecraft flew a 25-day mission around the Moon before returning to Earth for a precision splashdown.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First SLS flight', 'Farthest distance by a human-rated capsule'], video: null },
  { id: 'f9-dart', mission_name: 'DART', launch_date: '2021-11-24', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'interplanetary', launch_site: 'Vandenberg SLC-4E', launch_site_lat: 34.63, launch_site_lon: -120.63, payload_type: 'science', payload_mass_kg: 610, mission_description: 'NASA\'s Double Asteroid Redirection Test — the first planetary defense test mission. DART intentionally collided with asteroid Dimorphos, successfully altering its orbit.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First planetary defense test', 'First deliberate asteroid orbit change'], video: null },
  { id: 'f9-inspiration4', mission_name: 'Inspiration4', launch_date: '2021-09-15', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'LEO', launch_site: 'Kennedy Space Center LC-39A', launch_site_lat: 28.57, launch_site_lon: -80.65, payload_type: 'crewed', payload_mass_kg: 12055, mission_description: 'First all-civilian orbital spaceflight. Four private citizens spent three days orbiting Earth at 585 km altitude, the highest crewed orbit since Hubble servicing.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: ['First all-civilian orbital flight'], video: null },
  { id: 'mars2020-perseverance', mission_name: 'Mars 2020 / Perseverance', launch_date: '2020-07-30', rocket_name: 'Atlas V', rocket_variant: '541', provider: 'ULA', outcome: 'success', orbit_type: 'Mars', launch_site: 'Cape Canaveral SLC-41', launch_site_lat: 28.58, launch_site_lon: -80.58, payload_type: 'rover', payload_mass_kg: 4000, mission_description: 'NASA\'s Mars rover carrying the Ingenuity helicopter. Perseverance landed in Jezero Crater and has been collecting rock samples for future return to Earth. Ingenuity made 72 flights.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First Mars helicopter flight (Ingenuity)', 'First Mars sample caching'], video: null },
  { id: 'f9-gps-iii-sv04', mission_name: 'GPS III SV04', launch_date: '2020-11-05', rocket_name: 'Falcon 9', rocket_variant: 'Block 5', provider: 'SpaceX', outcome: 'success', orbit_type: 'MEO', launch_site: 'Cape Canaveral SLC-40', launch_site_lat: 28.56, launch_site_lon: -80.58, payload_type: 'navigation', payload_mass_kg: 4311, mission_description: 'Fourth GPS III satellite launched on a Falcon 9, providing next-generation GPS signals with improved accuracy and anti-jamming capabilities.', mission_patch_url: null, booster_landing_outcome: 'success', firsts: [], video: null },
  { id: 'soyuz-oneweb-12', mission_name: 'OneWeb #12', launch_date: '2021-10-14', rocket_name: 'Soyuz', rocket_variant: 'Soyuz-2.1b/Fregat', provider: 'Roscosmos', outcome: 'success', orbit_type: 'LEO', launch_site: 'Vostochny', launch_site_lat: 51.88, launch_site_lon: 128.33, payload_type: 'comms', payload_mass_kg: 5000, mission_description: 'Batch deployment of 36 OneWeb broadband satellites to low Earth orbit from Russia\'s Vostochny cosmodrome.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
  { id: 'tianwen1', mission_name: 'Tianwen-1', launch_date: '2020-07-23', rocket_name: 'Chang Zheng 5', rocket_variant: 'CZ-5', provider: 'CNSA', outcome: 'success', orbit_type: 'Mars', launch_site: 'Wenchang', launch_site_lat: 19.61, launch_site_lon: 110.95, payload_type: 'rover', payload_mass_kg: 5000, mission_description: 'China\'s first Mars mission combining an orbiter, lander, and rover (Zhurong). Successfully landed in Utopia Planitia, making China the second nation to operate a rover on Mars.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: ['First Chinese Mars landing', 'First Mars orbiter-lander-rover in one mission'], video: null },
  { id: 'vega-vv17', mission_name: 'Vega VV17', launch_date: '2020-11-17', rocket_name: 'Vega', rocket_variant: 'Vega', provider: 'ESA', outcome: 'failure', orbit_type: 'SSO', launch_site: 'Kourou ELV', launch_site_lat: 5.24, launch_site_lon: -52.77, payload_type: 'earth-observation', payload_mass_kg: 370, mission_description: 'Upper stage failure due to cable disconnection during staging. Two Earth observation satellites were lost.', mission_patch_url: null, booster_landing_outcome: null, firsts: [], video: null },
  { id: 'electron-running-out-of-fingers', mission_name: 'Running Out Of Fingers', launch_date: '2020-03-07', rocket_name: 'Electron', rocket_variant: 'KS', provider: 'Rocket Lab', outcome: 'success', orbit_type: 'LEO', launch_site: 'Mahia LC-1', launch_site_lat: -39.26, launch_site_lon: 177.86, payload_type: 'satellite', payload_mass_kg: 100, mission_description: 'Eleventh Electron launch deploying six payloads for the US Space Force, Planet Labs, and others.', mission_patch_url: null, booster_landing_outcome: 'expended', firsts: [], video: null },
];


// ── Paginated query API ──────────────────────────────────────────────────

const PAGE_SIZE = 20;

// Pre-build a search index for full-text search
const _searchableFields = ['mission_name', 'rocket_name', 'rocket_variant', 'provider', 'mission_description', 'orbit_type', 'launch_site', 'payload_type'];

function _normalise(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function _buildSearchText(record) {
  return _normalise(_searchableFields.map(f => record[f] || '').join(' '));
}

// Cache normalised search text per record
const _searchCache = new WeakMap();
function _getSearchText(record) {
  if (!_searchCache.has(record)) _searchCache.set(record, _buildSearchText(record));
  return _searchCache.get(record);
}

// ── Fuzzy matching: Levenshtein distance for typo tolerance ──
function _levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function _fuzzyMatch(term, text) {
  // Exact substring match — fast path
  if (text.includes(term)) return true;
  // Fuzzy: check each word in text for close matches
  const words = text.split(/\s+/);
  const threshold = term.length <= 3 ? 1 : term.length <= 6 ? 2 : 3;
  return words.some(w => {
    if (w.includes(term) || term.includes(w)) return true;
    // Only compare words of similar length to avoid expensive comparisons
    if (Math.abs(w.length - term.length) > threshold) return false;
    return _levenshtein(term, w) <= threshold;
  });
}

// ── Smart query parsing: extract year, outcome, and search terms ──
const _OUTCOME_KEYWORDS = { 'failed': 'failure', 'failure': 'failure', 'fail': 'failure', 'success': 'success', 'successful': 'success', 'partial': 'partial', 'anomaly': 'anomaly' };

function _parseSmartQuery(raw) {
  const result = { terms: [], year: null, outcome: null };
  const words = _normalise(raw).split(/\s+/).filter(Boolean);
  for (const w of words) {
    if (/^\d{4}$/.test(w)) { result.year = parseInt(w); continue; }
    if (_OUTCOME_KEYWORDS[w]) { result.outcome = _OUTCOME_KEYWORDS[w]; continue; }
    // Skip noise words
    if (['launches', 'launch', 'missions', 'mission', 'from', 'the', 'in', 'of', 'all'].includes(w)) continue;
    result.terms.push(w);
  }
  return result;
}


/**
 * @typedef {Object} QueryOptions
 * @property {string}  [search]        - Full-text search query
 * @property {string}  [provider]      - Filter by provider name (exact match)
 * @property {string}  [rocket]        - Filter by rocket name (exact match)
 * @property {string}  [outcome]       - Filter by outcome
 * @property {string}  [orbit_type]    - Filter by orbit type
 * @property {string}  [launch_site]   - Filter by launch site (contains match)
 * @property {number}  [year_min]      - Filter by minimum launch year
 * @property {number}  [year_max]      - Filter by maximum launch year
 * @property {'date'|'name'|'provider'} [sort_by]  - Sort field (default: 'date')
 * @property {'asc'|'desc'} [sort_dir] - Sort direction (default: 'desc')
 * @property {string}  [cursor]        - Cursor for pagination (ISO date + id)
 * @property {number}  [limit]         - Page size (default: 20, max: 100)
 */

/**
 * @typedef {Object} QueryResult
 * @property {LaunchRecord[]} data       - Page of results
 * @property {number}         total      - Total matching records
 * @property {string|null}    next_cursor - Cursor for next page (null if last page)
 * @property {boolean}        has_more   - Whether more pages exist
 * @property {number}         page_size  - Effective page size
 */


/**
 * Query the launch database with filtering, sorting, and cursor-based pagination.
 *
 * @param {LaunchRecord[]} dataset - The dataset to query (defaults to SEED_DATA)
 * @param {QueryOptions}   opts    - Query options
 * @returns {QueryResult}
 */
export function queryLaunches(dataset = SEED_DATA, opts = {}) {
  let results = [...dataset];

  // ── Filtering ──

  if (opts.provider) {
    const arr = (Array.isArray(opts.provider) ? opts.provider : [opts.provider]).map(s => s.toLowerCase());
    results = results.filter(r => arr.includes(r.provider.toLowerCase()));
  }

  if (opts.rocket) {
    const arr = (Array.isArray(opts.rocket) ? opts.rocket : [opts.rocket]).map(s => s.toLowerCase());
    results = results.filter(r => arr.includes(r.rocket_name.toLowerCase()));
  }

  if (opts.outcome) {
    const arr = Array.isArray(opts.outcome) ? opts.outcome : [opts.outcome];
    results = results.filter(r => arr.includes(r.outcome));
  }

  if (opts.orbit_type) {
    const arr = Array.isArray(opts.orbit_type) ? opts.orbit_type : [opts.orbit_type];
    results = results.filter(r => arr.includes(r.orbit_type));
  }

  if (opts.launch_site) {
    const ls = (Array.isArray(opts.launch_site) ? opts.launch_site[0] : opts.launch_site).toLowerCase();
    results = results.filter(r => r.launch_site.toLowerCase().includes(ls));
  }

  if (opts.year_min != null) {
    results = results.filter(r => parseInt(r.launch_date.slice(0, 4)) >= opts.year_min);
  }

  if (opts.year_max != null) {
    results = results.filter(r => parseInt(r.launch_date.slice(0, 4)) <= opts.year_max);
  }

  // ── Full-text search with fuzzy matching and smart parsing ──

  if (opts.search) {
    const parsed = _parseSmartQuery(opts.search);
    // Apply smart-parsed year filter
    if (parsed.year) results = results.filter(r => parseInt(r.launch_date.slice(0, 4)) === parsed.year);
    // Apply smart-parsed outcome filter
    if (parsed.outcome) results = results.filter(r => r.outcome === parsed.outcome);
    // Fuzzy match remaining terms
    const terms = parsed.terms;
    if (terms.length > 0) {
      // Score each result for relevance ranking
      results = results
        .map(r => {
          const text = _getSearchText(r);
          let score = 0;
          let allMatch = true;
          for (const t of terms) {
            if (text.includes(t)) { score += 10; }
            else if (_fuzzyMatch(t, text)) { score += 5; }
            else { allMatch = false; }
          }
          // Boost exact name matches
          const name = _normalise(r.mission_name);
          for (const t of terms) { if (name.includes(t)) score += 20; }
          return allMatch ? { ...r, _score: score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b._score - a._score);
    }
  }

  const total = results.length;

  // ── Sorting ──

  const sortBy = opts.sort_by || 'date';
  const sortDir = opts.sort_dir || 'desc';
  const dirMul = sortDir === 'asc' ? 1 : -1;

  results.sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'date':
        cmp = a.launch_date.localeCompare(b.launch_date);
        break;
      case 'name':
        cmp = a.mission_name.localeCompare(b.mission_name);
        break;
      case 'provider':
        cmp = a.provider.localeCompare(b.provider) || a.launch_date.localeCompare(b.launch_date);
        break;
      default:
        cmp = a.launch_date.localeCompare(b.launch_date);
    }
    return cmp * dirMul;
  });

  // ── Cursor-based pagination ──
  // Cursor format: "YYYY-MM-DD|id"

  const limit = Math.min(Math.max(opts.limit || PAGE_SIZE, 1), 100);
  let startIdx = 0;

  if (opts.cursor) {
    const [cursorDate, cursorId] = opts.cursor.split('|');
    // Find the index after the cursor record
    const cursorIdx = results.findIndex(r =>
      r.launch_date === cursorDate && r.id === cursorId
    );
    if (cursorIdx !== -1) {
      startIdx = cursorIdx + 1;
    }
  }

  const page = results.slice(startIdx, startIdx + limit);
  const hasMore = startIdx + limit < total;
  const lastRecord = page[page.length - 1];
  const nextCursor = hasMore && lastRecord
    ? `${lastRecord.launch_date}|${lastRecord.id}`
    : null;

  return {
    data: page,
    total,
    next_cursor: nextCursor,
    has_more: hasMore,
    page_size: limit,
  };
}


/**
 * Get all unique values for a given field (for building filter dropdowns).
 *
 * @param {LaunchRecord[]} dataset
 * @param {string} field
 * @returns {string[]} Sorted unique values
 */
export function getDistinctValues(dataset = SEED_DATA, field) {
  const values = new Set();
  for (const r of dataset) {
    const v = r[field];
    if (v != null && v !== '') values.add(v);
  }
  return [...values].sort();
}


/**
 * Get year range present in the dataset.
 *
 * @param {LaunchRecord[]} dataset
 * @returns {{ min: number, max: number }}
 */
export function getYearRange(dataset = SEED_DATA) {
  let min = 9999, max = 0;
  for (const r of dataset) {
    const y = parseInt(r.launch_date.slice(0, 4));
    if (y < min) min = y;
    if (y > max) max = y;
  }
  return { min, max };
}
