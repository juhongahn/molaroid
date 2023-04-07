export default function ImagePreView(props) {
    return (
        <div className="image">
    		<img src={URL.createObjectURL(props.files[0])} alt="image" />
            <span onClick={props.delImage}>&times;</span>
            <style jsx>{`
                .image {
                    width: 100%;
                    height: auto;
                    position: relative;
                    margin-bottom: 8px;
                }

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }

                span {
                    position: absolute;
                    top: -2px;
                    right: 9px;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                `}</style>
    	</div>
    )
}