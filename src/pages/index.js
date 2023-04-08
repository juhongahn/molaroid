import Head from 'next/head'
import ContentCard from '@/components/ContentCard';
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react';
export default function Home() {

  const [cardObjArray, setCardObjArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('api/image/list',{
        method: 'GET',    
        headers: {
              'Accept': 'application/json'
            }
        },
      );
      if (response.ok) {
        const data = await response.json();
        const srcArray = data.map((obj) => {
          return {
            imageSrc: `data:image/jpeg;base64,${obj.image}`,
            audioSrc: `data:audio/mpeg;base64,${obj.audio}`,
            text: obj.text,
          }
        });
        setCardObjArray(srcArray);
      }
    }
    fetchData();
  }, [])
  return (
    <>
      <Head>
        <title>
          몰라로이드
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="sm">

        {cardObjArray.length > 0? cardObjArray.map((cardObj, index) => ( 
          <div className='card-container' key={index}>
            <ContentCard
              imageSrc={cardObj.imageSrc}
              audioSrc={cardObj.audioSrc}
              text={cardObj.text}
            />
          </div>
      )):''}
        
      </Container>
      <style jsx>{`
          .card-container {
            margin-top: 20px;
          }
        
        `}</style>
    </>
  )
}
