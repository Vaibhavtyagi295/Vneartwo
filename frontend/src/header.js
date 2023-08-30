import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

const headerStyles = {
  width: '100%',
  backgroundColor: '#1976D2', // Adjust the color as needed
  marginBottom: '20px',
  padding: '10px 0',
};

const headerContentStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyles = {
  maxWidth: '60px', // Adjust the size as needed
};

const Header = () => {
  return (
    <AppBar position="static" style={headerStyles}>
      <Container>
        <Toolbar style={headerContentStyles}>
          <Typography variant="h6">Products</Typography>
          <Box>
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.rOE5qohl9bx_TVvIMpBbhwHaFF&pid=Api&P=0&h=180" // Replace with your logo image path
              alt="Logo"
              style={logoStyles}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
