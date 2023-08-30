import React from 'react';
import { Icon, List, ListItem, ListItemIcon, ListItemText, Typography, Grid, Paper } from '@mui/material';
import { Home, Info, MailOutline, PersonAdd } from '@mui/icons-material';

const Footer = () => {
  return (
      <Paper elevation={3} sx={{ backgroundColor: '#052C52', color: 'white', py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
          <Typography variant="h6" component="h4" gutterBottom>
            Explore
          </Typography>
          <List>
            <ListItem button component="a" href="/">
              <ListItemIcon>
                <Icon as={Home} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component="a" href="/aboutus">
              <ListItemIcon>
                <Icon as={Info} />
              </ListItemIcon>
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem button component="a" href="/contactpage">
              <ListItemIcon>
                <Icon as={MailOutline} />
              </ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItem>
            <ListItem button component="a" href="/joinus">
              <ListItemIcon>
                <Icon as={PersonAdd} />
              </ListItemIcon>
              <ListItemText primary="Join Us" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <div className="footer-logo">
            <img src="https://tse4.mm.bing.net/th?id=OIP.x0fRnWTiEGFnWRyz5xhEDAAAAA&pid=Api&P=0&h=180" alt="Company Logo" className="img-logo" />
          </div>
        </Grid>
        <Grid item xs={12} md={4} order={3}>
          <Typography variant="h6" component="h4" gutterBottom>
            Contact
          </Typography>
          <div className="footer-contact">
            <p>Vnear.in@company.com</p>
            <p>(123) 456-7890</p>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Footer;
