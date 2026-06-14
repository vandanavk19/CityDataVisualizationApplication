import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import MapComponent from '~/components/map';
import { getCity } from '~/data';
import { useEffect, useState } from 'react';
import CrashInsights from '~/components/CrashInsights';
import DataInfoCard from '~/components/DataInfoCard';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const cityId = params.cityId;
  if (!cityId) {
    throw new Error('City ID is required');
  }
  const city = await getCity(cityId);
  if (!city) {
    throw new Error('City not found');
  }
  return json({ city, mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN });
};

export default function City() {
  const { city, mapboxAccessToken } = useLoaderData<typeof loader>();

  const [crashData, setCrashData] = useState<any[]>([]);

  useEffect(() => {
    if (typeof city.dataUrl === 'string') {
      fetch(city.dataUrl)
        .then((res) => res.json())
        .then((data) => setCrashData(data))
        .catch(() => setCrashData([]));
    } else if (Array.isArray(city.dataUrl)) {
      setCrashData(city.dataUrl);
    }
  }, [city.dataUrl]);

  return (
    <div
      id="contact"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        display: 'block',
      }}
    >
      <DataInfoCard
        cityName={city.name}
        dataSourceUrl={
          city.name === 'Grand Rapids'
            ? 'https://grpd-grandrapids.hub.arcgis.com/datasets/grandrapids::traffic-crashes/about'
            : city.name === 'Chicago'
              ? 'https://data.cityofchicago.org/Public-Safety/Crimes-One-year-prior-to-present/x2n5-8w5q/about_data'
              : city.name === 'San Francisco'
                ? 'https://data.sfgov.org/Transportation/Bicycle-Parking-Racks/hn4j-6fx5/about_data'
                : city.name === 'New York'
                  ? 'https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/about_data'
                  : ''
        }
      />
      <MapComponent city={city} mapboxAccessToken={mapboxAccessToken ?? ''} />
      {city.name === 'Grand Rapids' && crashData.length > 0 && (
        <CrashInsights data={crashData} />
      )}
    </div>
  );
}
