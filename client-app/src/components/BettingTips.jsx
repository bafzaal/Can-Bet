import React,  { useEffect, useState } from "react";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";

const BettingTips = (props) => {
    return (
        <>
            <Container>
                <Row>
                      <h1 className="text-center headingLine">Betting Tips</h1>
                </Row>
                <Row>
                <p>It can be frusturating to lose sometimes, especially with money on the line. Please take some time and visit some resources like <a href="https://www.thesportsgeek.com/blog/11-sports-betting-strategies-for-beginners/">The Sports Geek</a> so you can 
                get a better grasp of what betting should be like. There are other external resources you can use to improve and we strongly suggest that you know
                what you are doing before beginning to bet. Remember, we are on your side!</p>
            </Row>
            </Container>
        </>
    )
}

export default BettingTips;