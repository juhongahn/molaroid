import Layout from '@/components/Layout';
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Layout >
        <Component {...pageProps} />
        <style global jsx>{`
            html, body{
              height: 100vh;
              padding: 0;
            }
          `}</style>
        </Layout>
    </>
  )
}
