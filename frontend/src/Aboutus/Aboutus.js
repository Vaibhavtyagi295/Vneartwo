import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaHeart, FaChartLine } from 'react-icons/fa';
import './About.css';

const AboutUs = () => {
  return (
    <div className="AboutUs">
      <Container>
        <header className="my-5">
          <h1 className="text-center">About Us</h1>
        </header>
        <Row className="align-items-center">
          <Col md={4}>
            <div className="feature-box">
              <img
                src="https://via.placeholder.com/150"
                alt="Who We Are"
                className="feature-image"
              />
              <h3>Who We Are</h3>
              <p>
                VNear is a dynamic company dedicated to empowering businesses to thrive in the digital age. Our team consists of passionate professionals who are committed to delivering top-notch solutions for our clients.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box">
              <img
                src="https://via.placeholder.com/150"
                alt="What We Do"
                className="feature-image"
              />
              <h3>What We Do</h3>
              <p>
                Our mission at VNear is to create innovative products and provide exceptional services that elevate businesses to new heights. We specialize in helping businesses sell a wide range of products online, from timeless classics to the latest trends.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box">
              <img
                src="https://via.placeholder.com/150"
                alt="Our Impact"
                className="feature-image"
              />
              <h3>Our Impact</h3>
              <p>
                With a proven track record, we have significantly contributed to the success of numerous clients' businesses. Our dedication to excellence has left a positive impact on the way businesses operate and connect with their customers.
              </p>
            </div>
          </Col>
        </Row>
        <Row className="my-5">
          <Col md={6}>
            <div className="article">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Article 1"
                className="article-image"
              />
              <h3>Empowering Businesses Online</h3>
              <p>
                In one of our featured articles, we explore how VNear has been empowering businesses to establish a strong online presence. From helping entrepreneurs open their online shops for free to assisting established brands in reaching new digital markets, we're dedicated to driving growth through digital solutions.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="article">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Article 2"
                className="article-image"
              />
              <h3>Supporting Workforce Efficiency</h3>
              <p>
                Another one of our insightful articles delves into our commitment to not only businesses but also households. Learn about how VNear provides skilled workers for various household tasks, allowing families to delegate their home-related responsibilities and achieve a better work-life balance.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
