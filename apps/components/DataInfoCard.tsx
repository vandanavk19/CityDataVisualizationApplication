import { useState } from 'react';
import { Card, CardContent, Button } from '@mui/material';

type Props = {
  cityName: string;
  dataSourceUrl: string;
};

const cityDescriptions: Record<string, string> = {
  'Grand Rapids':
    'The Grand Rapids Traffic Crashes dataset provides raw records of motor vehicle incidents reported in the city. It is maintained by the Grand Rapids Police Department and updated frequently to reflect new reports. This dataset is essential for analyzing traffic safety trends, evaluating crash severity, and supporting decisions around road safety improvements. It offers public transparency and serves as a resource for researchers, policymakers, and residents interested in local transportation issues.',
  Chicago:
    "This dataset tracks publicly reported criminal incidents in Chicago, excluding murders where specific victim data is confidential. Compiled from the city's CLEAR system, it offers a rolling view of crime activity while anonymizing exact locations to protect individuals' privacy. The dataset helps inform public safety strategies, community engagement efforts, and media reporting. It's updated regularly to reflect recent trends and supports transparency and accountability in law enforcement operations.",
  'San Francisco':
    'This dataset catalogs the official bicycle parking racks installed across San Francisco by the SFMTA. It serves as a public infrastructure record to help cyclists locate safe and accessible places to secure their bikes. The dataset includes locations of racks installed on sidewalks, in street-level corrals, garages, and parklets, but excludes privately owned or managed racks. The information supports planning, maintenance, and service requests, reflecting San Francisco’s commitment to sustainable transportation infrastructure.',
  'New York':
    "This dataset is the result of New York City's TreesCount! 2015 initiative, the largest street tree census in NYC history. Conducted with the help of thousands of volunteers, it documents the types, sizes, and health of over 666,000 street trees across all boroughs. It provides a snapshot of the urban forest under the jurisdiction of NYC Parks and informs ongoing urban forestry management through the ForMS system. The dataset supports environmental planning, public health studies, and greening strategies.",
};

export default function DataInfoCard({ cityName, dataSourceUrl }: Props) {
  const [visible, setVisible] = useState(false);
  const description =
    cityDescriptions[cityName] || 'No description available for this city.';

  return (
    <div
      style={{
        position: 'absolute',
        top: 90,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Button variant="contained" onClick={() => setVisible(!visible)}>
        Explore Data
      </Button>

      {visible && (
        <Card
          style={{
            backgroundColor: 'white',
            width: 350,
            padding: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <CardContent>
            <h3 style={{ marginTop: 0 }}>{cityName} – City Data</h3>
            <p style={{ fontSize: '0.95rem', color: '#333' }}>{description}</p>
            <a
              href={dataSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 'bold',
                color: '#1976d2',
                textDecoration: 'underline',
              }}
            >
              View Data Source ↗
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
