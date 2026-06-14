import { useState } from 'react';
import { Card, CardContent, Button } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type Crash = {
  'Crash Type': string;
  'Crash Severity': string;
};

type Props = {
  data: Crash[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function CrashInsights({ data }: Props) {
  const [show, setShow] = useState(false);

  const byType = Object.entries(
    data.reduce(
      (acc, cur) => {
        acc[cur['Crash Type']] = (acc[cur['Crash Type']] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([type, count]) => ({ type, count }));

  const bySeverity = Object.entries(
    data.reduce(
      (acc, cur) => {
        acc[cur['Crash Severity']] = (acc[cur['Crash Severity']] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([severity, value]) => ({ name: severity, value }));

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setShow(!show)}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}
      >
        Explore Insights
      </Button>
      {show && (
        <Card
          style={{
            position: 'absolute',
            top: 70,
            right: 20,
            zIndex: 1000,
            width: 400,
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'white',
          }}
        >
          <CardContent>
            <h3>Crashes by Type</h3>
            <BarChart width={360} height={200} data={byType}>
              <XAxis dataKey="type" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>

            <h3>Crashes by Severity</h3>
            <PieChart width={360} height={200}>
              <Pie
                data={bySeverity}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {bySeverity.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      )}
    </>
  );
}
