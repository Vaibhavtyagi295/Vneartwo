import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './WhatWeDoPage.css';

const WhatWeDo = () => {
  return (
    <div className="what-we-do">
      <main>
        <Container>
          <Row>
            <Col md={6} className="d-flex justify-content-center">
              <img
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3"
                alt="What We Do"
                className="image"
              />
            </Col>
            <Col md={6}>
              <div className="content">
                <h2>What We Do</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis quam sed ante ultricies, in varius
                  est vehicula. Fusce vulputate scelerisque justo, sit amet rutrum elit tristique nec. Nullam lobortis
                  lobortis tellus, sit amet lacinia velit bibendum at. Fusce efficitur mi mauris, at eleifend odio
                  rutrum nec.
                </p>
                {/* Add more content about what you do */}
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default WhatWeDo;
