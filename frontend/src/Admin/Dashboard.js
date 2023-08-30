import React, { Suspense } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { style } from '@mui/system';
import './sty.css';

const DynamicVictoryBar = React.lazy(() => import('victory').then((module) => ({ default: module.VictoryBar })));
const DynamicVictoryChart = React.lazy(() => import('victory').then((module) => ({ default: module.VictoryChart })));
const DynamicVictoryAxis = React.lazy(() => import('victory').then((module) => ({ default: module.VictoryAxis })));
const DynamicVictoryTooltip = React.lazy(() => import('victory').then((module) => ({ default: module.VictoryTooltip })));

const DynamicBarChart = React.lazy(() => import('recharts').then((module) => ({ default: module.BarChart })));
const DynamicBar = React.lazy(() => import('recharts').then((module) => ({ default: module.Bar })));
const DynamicXAxis = React.lazy(() => import('recharts').then((module) => ({ default: module.XAxis })));
const DynamicYAxis = React.lazy(() => import('recharts').then((module) => ({ default: module.YAxis })));
const DynamicCartesianGrid = React.lazy(() => import('recharts').then((module) => ({ default: module.CartesianGrid })));
const DynamicTooltip = React.lazy(() => import('recharts').then((module) => ({ default: module.Tooltip })));
const DynamicLegend = React.lazy(() => import('recharts').then((module) => ({ default: module.Legend })));

const Dashboard = () => {
  const monthlyTrafficData = [
    { month: 'January', visitors: 2000 },
    { month: 'February', visitors: 1800 },
    { month: 'March', visitors: 2200 },
    { month: 'April', visitors: 2400 },
    { month: 'May', visitors: 2300 },
    { month: 'J', visitors: 2500 },
    { month: 'Jujewfne', visitors: 2500 },
    { month: 'Jbjrwfune', visitors: 2500 },
    { month: 'Jubewfbne', visitors: 2500 },
    { month: 'Jubwfne', visitors: 2500 },
  ];

  const workersData = [
    { role: 'Developer', workers: 12 },
    { role: 'Designer', workers: 8 },
    { role: 'Marketer', workers: 6 },
    { role: 'Analyst', workers: 10 },
    { role: 'Analyst', workers: 10 },
  ];

  return (
    <div className="dashboard-container">
      <div className="graph-container">
        <h2>Monthly Traffic</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicVictoryChart domainPadding={20} height={250}>
            <DynamicVictoryAxis
              tickValues={monthlyTrafficData.map((d) => d.month)}
              style={{ tickLabels: { fontSize: 10, padding: 5 } }}
            />
            <DynamicVictoryAxis dependentAxis />
            <DynamicVictoryBar
              data={monthlyTrafficData}
              x="month"
              y="visitors"
              style={{ data: { fill: '#8884d8' } }}
              labels={({ datum }) => datum.visitors}
              labelComponent={<DynamicVictoryTooltip />}
            />
          </DynamicVictoryChart>
        </Suspense>
      </div>
      <div className="graph-container">
        <h2>Workers</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicBarChart width={350} height={250} data={workersData}>
            <DynamicCartesianGrid strokeDasharray="3 3" />
            <DynamicXAxis dataKey="role" />
            <DynamicYAxis />
            <DynamicTooltip />
            <DynamicLegend />
            <DynamicBar dataKey="workers" fill="#8884d8" />
          </DynamicBarChart>
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
