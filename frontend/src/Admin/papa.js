import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;

const ResponsiveGrid = styled(Grid)`
  @media (max-width: 600px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const Dashboard = () => {
  // Sample data for the chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75,192,192,0.4)',
      },
    ],
  };
  

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <ResponsiveGrid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Bar data={chartData} />
        </Grid>
        {/* Add more grid items for additional charts or components */}
      </ResponsiveGrid>
    </StyledContainer>
  );
};

export default Dashboard;
