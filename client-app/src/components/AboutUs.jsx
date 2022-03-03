import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import AboutUsCard from "./AboutUsCard";
const useStyles =   makeStyles((theme) => ({
  root:{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
export default function () { 
    const classes = useStyles();
    return <div id= "About-us" className = {classes.root}> <AboutUsCard></AboutUsCard></div>
}
