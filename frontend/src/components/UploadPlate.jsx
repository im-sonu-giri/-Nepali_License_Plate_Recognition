import React, { useState } from "react";
import axios from "axios";

export default function UploadPlate()
{
    const [file , setFile ]= useState(null);
    const [result, setResult] = useState(null);
    
    const handleFileChange = (e) =>{
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(!file)
        {
            alert("please select an image");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res =await axios.post("http://localhost:8000/detect", formData);
            setResult(res.data);
        }
        catch(error)
        {
            console.error("Error:", error);
            alert("Error uploading image");
        }
    };

    

}