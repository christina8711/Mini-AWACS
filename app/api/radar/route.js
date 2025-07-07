// /app/api/radar/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));
  const alt = parseFloat(searchParams.get('alt'));

  const radarPoints = Array.from({ length: 15 }).map(() => {
    const range = Math.random() * 50; // km
    const azimuth = Math.random() * 360;
    const elevationAngle = Math.random() * 30 - 10; // -10° to +20°

    // Convert to radians
    const bearingRad = (azimuth * Math.PI) / 180;
    const elevRad = (elevationAngle * Math.PI) / 180;

    // Approximate lat/lon change
    const dx = range * Math.cos(bearingRad) / 111; // degrees
    const dy = range * Math.sin(bearingRad) / 111;

    const targetAlt = alt + (range * 1000) * Math.sin(elevRad);

    return {
      azimuth,
      range,
      elevationAngle,
      lat: lat + dy,
      lon: lon + dx,
      alt: targetAlt,
    };
  });

  return Response.json({
    plane: { lat, lon, alt },
    radarPoints,
  });
}
