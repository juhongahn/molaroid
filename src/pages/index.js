import { Container, Grid } from "@mui/material"
import Lottie from "react-lottie-player";
import lottieJson from "../../public/main_lottie.json";
import Link from "next/link";
import Head from "next/head";

export default function Main() {
    return (
        <>
        <Head>
            <title>몰라로이드</title>
        </Head>
        <Container>
            <Grid
                container
                alignItems="center"
            >
                <Grid
                    item
                    xs={4}
                >
                    <div>
                        <h1>
                            
                            몰라로이드
                        </h1> 
                        <p>
                            사진을 업로드하고
                            <br />
                            ai가 만들어주는 글귀와 음악을 감상해 보세요.
                        </p>
                    </div>
                    <Link href={'/main'} style={{
                        textDecoration: 'underline',
                        fontSize: '1.1rem'
                    }}>
                        더 알아보기
                    </Link>
                </Grid>
            <Grid
                item
                xs={8}
                sx={{
                    height: '100%',
                    width: '100%',
                    mt: '60px',
                }}
            >
                <Lottie loop animationData={lottieJson} play/>;
            </Grid>
            </Grid>
                <style global jsx>{`
                    body{
                        background-color: #f5eee6;
                    }

                    h1{
                        font-size: 4rem;
                        margin-bottom: 0px;
                    }
                    
                    p{
                        font-size: 1.3rem;
                    }

                `}</style>
            </Container>
        </>
    )
}
