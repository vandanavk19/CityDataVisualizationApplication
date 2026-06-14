import { matchSorter } from 'match-sorter';
// @ts-expect-error - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';

export type CityMutation = {
  id: string;
  name: string;
  dataUrl: string;
  location: {
    lat: number;
    long: number;
  };
  layer: 'HexagonLayer' | 'LineLayer';
};

export type BikeRack = {
  ADDRESS: string;
  SPACES: number;
  COORDINATES: [longitude: number, latitude: number];
};

export type ContactRecord = CityMutation & {
  id: string;
  createdAt: string;
};

const fakeCities = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeCities.records)
      .map((key) => fakeCities.records[key])
      .sort(sortBy('-createdAt', 'last'));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeCities.records[id] || null;
  },

  async create(values: CityMutation): Promise<ContactRecord> {
    const createdAt = new Date().toISOString();
    const newContact = { createdAt, ...values };
    fakeCities.records[values.id] = newContact;
    return newContact;
  },

  async set(id: string, values: CityMutation): Promise<ContactRecord> {
    const contact = await fakeCities.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeCities.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeCities.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getCities(query?: string | null) {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  let cities = await fakeCities.getAll();
  if (query) {
    cities = matchSorter(cities, query, {
      keys: ['name'],
    });
    return cities;
  }
  return cities.sort(sortBy('name', 'createdAt'));
}

export async function getCity(id: string) {
  return fakeCities.get(id);
}

export async function updateCity(id: string, updates: CityMutation) {
  const city = await fakeCities.get(id);
  if (!city) {
    throw new Error(`No city found for ${id}`);
  }
  await fakeCities.set(id, { ...city, ...updates });
  return city;
}

export async function deleteCity(id: string) {
  fakeCities.destroy(id);
}

[
  {
    id: '1',
    name: 'New York',
    dataUrl:
      'https://data.cityofnewyork.us/resource/uvpi-gqnh.json?$limit=5000&boroname=Manhattan',
    location: {
      lat: 40.741895,
      long: -73.989308,
    },
    layer: 'HexagonLayer',
  },
  {
    id: '2',
    name: 'Grand Rapids',
    dataUrl: '/grand_rapids_crashes.json',
    location: {
      lat: 42.96336,
      long: -85.668083,
    },
    layer: 'HexagonLayer',
  },
  {
    id: '3',
    name: 'Chicago',
    dataUrl: '/Chicagocrime.json',
    location: {
      lat: 41.8781,
      long: -87.6298,
    },
    layer: 'HexagonLayer',
  },
  {
    id: '4',
    name: 'San Francisco',
    dataUrl:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
    location: {
      lat: 37.7749,
      long: -122.4194,
    },
    layer: 'HexagonLayer',
  },
].forEach((city) => {
  fakeCities.create({
    ...(city as CityMutation),
  });
});
