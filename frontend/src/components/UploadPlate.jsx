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
    }
}