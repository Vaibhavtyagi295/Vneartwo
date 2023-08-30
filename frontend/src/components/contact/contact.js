import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Room, Phone, Mail, Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  mapContainer: {
    height: '400px',
    marginBottom: theme.spacing(3),
  },
  formContainer: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  contactIcon: {
    fontSize: '2rem',
    marginRight: theme.spacing(1),
    color: '#007bff',
  },
  submitButton: {
    backgroundColor: '#25D366',
    color: '#fff',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#128C7E',
    },
  },
  formTitle: {
    marginBottom: theme.spacing(3),
    color: '#007bff',
  },
}));

const ContactPage = (e) => {


  const classes = useStyles();
  const history = useHistory(); 
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
 
    const formElement = document.getElementById('contactForm'); 

    if (!formElement) {
      console.error("Form element 'contactForm' not found.");
      return;
    }
  

    const formData = new FormData(formElement);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Send WhatsApp message with the form details
    const whatsappMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = '+917470817792'; // Replace this with your actual WhatsApp number (with country code)

    // Redirect to WhatsApp app with the message
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };


  return (
    <Container className={classes.container}>
      <Row>
        <Col md={6}>
          {/* Google Maps Embed (Replace with your actual Google Maps embed URL) */}
          <div className={classes.mapContainer}>
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.7490901647697!2d-122.08424708482285!3d37.422408477088495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e34d59144c7%3A0xf96a05262e3b7a31!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1630435051365!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          </div>
      
        </Col>
        <Col md={6}>
          <div className={classes.formContainer}>
            <h2 className={classes.formTitle}>Contact Us</h2>
            <Form id="contactForm">
  <Form.Group controlId="formName">
    <Form.Label>Your Name</Form.Label>
    <Form.Control name="formName" type="text" placeholder="Enter your name" />
  </Form.Group>

  <Form.Group controlId="formEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control name="formEmail" type="email" placeholder="Enter email" />
  </Form.Group>

  <Form.Group controlId="formMessage">
    <Form.Label>Message</Form.Label>
    <Form.Control name="formMessage" as="textarea" rows={4} placeholder="Your message here" />
  </Form.Group>

  <Button
    className={classes.submitButton}
    type="button" // Change type to "button" to prevent form submission on click
    startIcon={<Send />}
    onClick={handleFormSubmit} // Attach the handleFormSubmit function to onClick event
  >
    Submit
  </Button>
</Form>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
