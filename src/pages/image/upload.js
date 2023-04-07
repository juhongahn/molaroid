import { useState, useRef } from "react";
import { Container } from "@mui/material";
import ImagePreView from "@/components/image/ImagePreview";
import CircularProgress from '@mui/material/CircularProgress';

export default function UploadImage() {

    const [files, setFiles] = useState([]);
    const fileInputRef = useRef();
    const dragAreaRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const delImage = () => setFiles([]);
    
    const handleFileUpload = (event) => {
        const newFiles = event.target.files;
        setFiles(newFiles);
    }

    const openFileUpload = () =>  fileInputRef.current.click();

    const imgDragOverHandler = (event) => {
        event.preventDefault();
        dragAreaRef.current.classList.add('dragover');
    };

    const imgDragLeaveHandler = (event) => {
        event.preventDefault();
        dragAreaRef.current.classList.remove('dragover');
    };

    const imgDropHandler = (event) => {
        event.preventDefault();
        const newFiles = event.dataTransfer.files;
        dragAreaRef.current.classList.remove('dragover');
        setFiles(newFiles);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (files.length <= 0) {
            alert('사진을 업로드 해주세요');
            return;
        }
        formData.append('image', files[0]);

		setIsLoading(true);
		
        fetch('/api/image/generate', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) { 
				return response.blob();
            }
            throw new Error('Network response was not ok.');
          })
          .then( data  => {
			  const reader = new FileReader();
			  reader.onload = function() {
				const parts = reader.result.split('\r\n--myboundary\r\n');
				const inputImage = parts[0];
				const outputAudio = parts[1];
				const outputText = parts[2];
			  
				// 받은 데이터 처리
				console.log(inputImage)
				console.log(typeof inputImage)
				console.log(outputAudio)
				console.log(typeof outputAudio)
				console.log(outputText)
				console.log(typeof outputText)
			  }
			  reader.readAsText(data);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    }

    return (
        <Container maxWidth="sm">
			<div className="card">
				<div className="top">
					<p>사진을 여기에 끌어다 놓으세요</p>
					<button type="button" onClick={handleSubmit}>업로드</button>
				</div>
				<div className="drag-area"
					onDragOver={imgDragOverHandler}
					onDragLeave={imgDragLeaveHandler}
					onDrop={imgDropHandler}
					ref={dragAreaRef}
				>
					<span className="visible">
						끌어다 놓거나
						<span className="select" role="button" onClick={openFileUpload}>컴퓨터에서 선택</span>
					</span>
					<span className="on-drop">Drop images here</span>
					<input name="file" type="file" className="file"
						onChange={handleFileUpload}
						ref={fileInputRef}/>
				</div>

				<div className="container">
					{files.length > 0 && <ImagePreView files={files} delImage={ delImage } />}
				</div>
			</div>

			{isLoading &&
				<div className="spinner-container">
					<CircularProgress/>
				</div>
			}
            <style jsx>{`
                .card {
                    width: 100%;
                    height: auto;
                    padding: 15px;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
                    border-radius: 5px;
                    overflow: hidden;
                    background: #fafbff;
                    margin-top: 10px;   
                }

                .card .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .card p {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #878a9a;
                }

                .card button {
                    outline: 0;
                    border: 0;
                        -webkit-appearence: none;
                    background: #3f50b5;
                    color: #fff;
                    border-radius: 4px;
                    transition: 0.3s;
                    cursor: pointer;
                    font-weight: 400;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
                    font-size: 0.8rem;
                    padding: 8px 13px;
                }
                .card button:hover {
                    opacity: 0.8;
                }

                .card button:active {
                    transform: translateY(5px);
                }

                .card .drag-area {
                    width: 100%;
                    height: 160px;
                    border-radius: 5px;
                    border: 2px dashed #d5d5e1;
                    color: #c8c9dd;
                    font-size: 0.9rem;
                    font-weight: 500;
                    position: relative;
                    background: #dfe3f259;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    user-select: none;
                    -webkit-user-select: none;
                    margin-top: 10px;
                }

                .card .drag-area .visible {
                    font-size: 18px;
                }
                .card .select {
                    color: #5256ad;
                    margin-left: 5px;
                    cursor: pointer;
                    transition: 0.4s;
                }

                .card .select:hover {
                    opacity: 0.6;
                }

                .card .container {
                    width: 100%;
                    height: auto;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    overflow-y: auto;
                    margin-top: 10px;
                }

                /* dragover class will used in drag and drop system */
                .card .drag-area.dragover {
                    background: rgba(0, 0, 0, 0.4);
                }

                .card .drag-area.dragover .on-drop {
                    display: inline;
                    font-size: 28px;
                }

                .card input,
                .card .drag-area .on-drop, 
                .card .drag-area.dragover .visible {
                    display: none;
                }
				.spinner-container {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					
				}
                                
            `}</style>
            </Container>
    )
}