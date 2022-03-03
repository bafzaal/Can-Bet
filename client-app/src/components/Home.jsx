import React, { useEffect, useState } from "react";
import { Row, Form, Container, Col, Button, Select, Collapse } from "react-bootstrap";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import {Link as Scroll} from 'react-scroll'
import AboutUs from "./AboutUs";
const useStyles =   makeStyles((theme) => ({
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    textAlign: 'center',
  },
  title:{
    fontSize:"4rem",
  },
  siteName:{
    color: '#fe0000',
  },
  downArrow:{
    fontSize: '2rem',
  }
}));
const Home = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true);
  })



  return (
    <div>
        <Container className= {classes.container}>
            <Row>
              <div>
                <h1 className={classes.title}>Welcome to <br /> <span> <b><span className={classes.siteName}>Can</span>-Bet</b></span></h1>
              </div>
              <Scroll to="About-us">
              <IconButton>
                <ExpandMoreIcon className={classes.downArrow}/>
              </IconButton>
              </Scroll>
            </Row>
          </Container>
      <AboutUs />
    </div>
    );
};

export default Home;
