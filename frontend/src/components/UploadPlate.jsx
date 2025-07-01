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
        
    }
}