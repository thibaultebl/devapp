import fs from "fs/promises";
import fetch from "node-fetch";

const nearbyApiKey = "AIzaSyC339PSTbM5RU0ykGexdiPxzm1JCDPzjdM";
const detailsApiKey = "AIzaSyBogkta-03vAlrSTcM59X0LIYpQXeEr-B4";

const userLocation = "-34.527866,-56.283372";
const radius = "25000";
const type = "restaurant";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Step 1: Get Nearby Places
async function getNearbyPlaces(): Promise<string[]> {
  const params = new URLSearchParams({
    location: userLocation, // fix key name here
    radius,
    type,
    key: nearbyApiKey,
  });

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json() as {
      results: { place_id: string }[];
    };
    const placeIds = data.results.map((place: any) => place.place_id);
    return placeIds;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return [];
  }
}

// Step 2: Get Details for Each Place
async function getPlaceDetails(placeId: string): Promise<any | null> {
  const params = new URLSearchParams({
    place_id: placeId,
    key: detailsApiKey,
    fields: "name,business_status,geometry,photos,rating,reviews,types,user_ratings_total,website",
    language: "en",
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json() as { result: any };
    return data.result;
  } catch (error) {
    console.error(`Error fetching details for ${placeId}:`, error);
    return null;
  }
}

// Step 3: Orchestrate the Whole Flow and Save to File
async function fetchAllDetails() {
  const placeIds = await getNearbyPlaces();

  const allDetails: any[] = [];

  for (let i = 0; i < placeIds.length; i++) {
    const placeId = placeIds[i];
    const details = await getPlaceDetails(placeId);
    if (details) {
      allDetails.push(details);
    }
    await delay(200); // avoid rate limit
  }

  console.log(`Fetched ${allDetails.length} places. Writing to JSON file...`);

  try {
    await fs.writeFile("places.json", JSON.stringify(allDetails, null, 2));
    console.log("✅ Saved to places.json");
  } catch (err) {
    console.error("❌ Error writing to file:", err);
  }

  return allDetails;
}

fetchAllDetails();
