import React, {useState} from "react";
import axios from "axios";

export default function UploadPlate()
{
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
}