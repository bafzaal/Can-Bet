import React,  { useEffect, useState } from "react";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";

const ResponsibleGambling = (props) => {
    return (
        <>
            <Container>
            <Row>
                <h1 className="text-center headingLine">Responsible Gambling</h1>
            </Row>
            <Row>
                <p>For more information on Responsible Gambling, please visit the <a href="https://www.responsiblegambling.org/">Responsible Gaming Council's website</a> for more information about gambling safety in Canada.</p>
            </Row>
            </Container>
        </>
    )
}

export default ResponsibleGambling;