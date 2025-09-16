import { useState } from "react";
import axios from "axios";

export default function UploadTest() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // 👈 multer me name "image" hi hai

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Upload successful!");
      setPreview(res.data.url); // Uploaded image ka URL aa jayega
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Image Test</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
      {preview && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={preview} alt="Uploaded" width="300" />
        </div>
      )}
    </div>
  );
}
