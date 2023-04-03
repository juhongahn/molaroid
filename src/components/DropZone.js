import React from "react";
import Image from "next/image";
import FilePreview from "./FilePreview";
import styles from "../styles/DropZone.module.css";

export default function DropZone() {
  return (
    <>
      <div className={styles.dropzone}>
        <Image src="/upload.svg" alt="upload" height={50} width={50} />
        <input id="fileSelect" type="file" multiple className={styles.files} />
        <label htmlFor="fileSelect">You can select multiple Files</label>
        <h3 className={styles.uploadMessage}>
          or drag &amp; drop your files here
        </h3>
      </div>
      {/* Pass the selectect or dropped files as props */}
    </>
  );
};
