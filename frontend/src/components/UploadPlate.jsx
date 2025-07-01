import React, {useState} from "react";
import axios from "axios";

export default function UploadPlate()
{
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    

        if (!file) {
            alert("please select an image file");
            return
        }

        const formData = new FormData();
        formData.append("file", file);

        try{
            const response = await axios.post("http://127.0.0.1:8000/detect", formData ,{
                headers:{
                    "content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        }
        catch(error) {
            console.error("error uploading image:", error);
            setResult({message: "failed to detect license plate"});
        }


    };

    return(
        <div style = {{ textAlign: "center"}}>
        <h2>Upload an image of a vehicle to recognize the Nepali license plate.</h2>
        
        <form onSubmit={handleSubmit}> 
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit" disabled={!file}>Recognize License Plate</button>
        </form>

        {result && (
            <div style={{marginTop: "20px" }}>
            <h3>{result.message}</h3>
             {result.count !== undefined && <p>Detected plates count: {result.count}</p>}
            {result.detections && result.detections.map((det, index) => (
                 <div key={index}>

                    <p> Plate {index + 1}: {det.text}</p>
                </div>
                ))}
        </div>
            )}
    </div>
        
    );
}