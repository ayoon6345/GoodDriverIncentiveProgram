// PointsOverview.js
import React from 'react';
import {Container, Row, Col} from "react-bootstrap";

function PointsOverview() {
  return (
    <div>
      <h2>Points Overview</h2>
      {/* Display points balance and history */}
      <Container>
          <Row>
              <Col id="point-div" className="text-center border">
                  <p id="point-value">100</p>
                  <p>points</p>
              </Col>
          </Row>
          <Row>
              <Col className='border'>
              </Col>
              <Col className='border'>2 of 3</Col>
              <Col className='border'>3 of 3</Col>
          </Row>
      </Container>
    </div>
  );
}

export default PointsOverview;
