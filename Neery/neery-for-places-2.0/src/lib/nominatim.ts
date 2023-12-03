interface NominatimObject {
  place_id: number,
  lat: string,
  lon: string,
}

export async function getPoint(x: {
  street: string,
  city: string,
  county?: string,
  state?: string,
  country: string,
  postal_code?: string,
}): Promise<[number, number] | undefined> {
  const query = {
    format: "jsonv2",
    ...(Object.fromEntries(Object.entries(x).filter(([_k, v]) => v !== undefined))),
  } as Record<string, string>;

  const res = await fetch("https://nominatim.openstreetmap.org/search?" + new URLSearchParams(query).toString(), {
    headers: {
      "User-Agent": "NeerY, contact: mogery@neery.net",
    },
  });

  const obj = await res.json() as NominatimObject[];

  if (obj.length > 0) {
    return [
      parseFloat(obj[0].lat),
      parseFloat(obj[0].lon),
    ];
  } else {
    return undefined;
  }
}
