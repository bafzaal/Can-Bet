import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Gambler from '../images/Gambling.jpeg'
import { makeStyles } from "@mui/styles";

const useStyles =   makeStyles((theme) => ({
    root:{
      minHeight: '100vh',
    },
    media: {
        height: 140,
    }
  }));
export default function AboutUsCard() {
  return (
    <Card sx={{ maxWidth: 645 }}>
      <CardMedia
        component="img"
        height="440"
        image = {Gambler}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <b> About Can-Bet </b>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Betting just got way easier. 
          Can-Bet offers tools to help bettors track their performance while providing recommendations based on previous bets.
          You can also keep track of upcoming games and the different odds on various sites to give you the best chance at a payday.
          Want to show you are number one? Enter the leaderboards and find out.
        </Typography>
      </CardContent>
    </Card>
  );
}