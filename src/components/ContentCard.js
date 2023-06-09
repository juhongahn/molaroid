import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function ContentCard(props) {
  return (

    <Card >
      <CardMedia
        component="img"
        height="300"
        image={props.imageSrc}
        alt="업로드 이미지"
        sx={{ objectFit: "scale-down" }}
      />
      <audio
        controls
        src={props.audioSrc}
        className='audio'>
            
      </audio>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.text}
        </Typography>
      </CardContent>

      <style jsx>{`
        .audio{
          width: 100%;
          background-color: #f1f3f4;
        }
        img {
          object-fit: scale-down;
        }
        
        `}</style>
    </Card>
  );
}
