import Head from 'next/head'
import ContentCard from '@/components/ContentCard';
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useState, useEffect } from 'react';

export default function Home() {
  
  const [cardDataObjArray, setCardDataObjArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/image');
      if (response.ok) {
        const data = await response.json();
	console.log(data);
        setCardDataObjArray(data);
      } else {
        alert("데이터를 불러오는데 실패 했습니다");
        window.location.reload();
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

        {cardDataObjArray.length > 0 ? cardDataObjArray.map((cardDataObj) => {
          <div className='card-container'>
            <ContentCard
              imageSrc={cardDataObj.image}
              audioSrc={cardDataObj.audio}
              text={cardDataObj.text}
            />
          </div>
      }):''}
        
      </Container>

      <style jsx>{`
          .card-container {
            margin-top: 20px;
          }
        
        `}</style>
    </>
  )
}
