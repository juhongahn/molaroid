import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Image from 'next/image';

export default function ContentCard(props) {
  return (

    <Card >
      <CardMedia
        component="img"
        height="300"
        image={props.imageSrc}
        alt="Paella dish"
      />
      <audio
        controls
        src={props.audioSrc}
        className='audio'>
            <a href="/media/cc0-audio/t-rex-roar.mp3">
                Download audio
            </a>
      </audio>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <style jsx>{`
        .audio{
          width: 100%;
          background-color: #f1f3f4;
        }
        
        `}</style>
    </Card>
  );
}