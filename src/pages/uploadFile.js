import Head from "next/head";
import DropZone from "../components/DropZone";
import styles from "../styles/UploadFile.module.css";

export default function UploadFile() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Drag And Drop File Upload</title>
        <meta name="description" content="Nextjs drag and drop file upload" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Drag And Drop File Upload</h1>
        <DropZone />
      </main>

      <footer className={styles.footer}>
        <div>{new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}