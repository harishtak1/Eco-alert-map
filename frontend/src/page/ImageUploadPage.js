import React, { useState } from "react";

export default function ImageUploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // preview before upload
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // 👈 backend me multer "image" expect kar raha hai

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setUploadedUrl(data.imageUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📤 Upload Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <h4>Preview:</h4>
          <img
            src={preview}
            alt="preview"
            style={{ width: 200, border: "1px solid #ccc" }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{
          marginTop: 20,
          padding: "8px 16px",
          background: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upload
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: 20 }}>
          <h4>✅ Uploaded Image:</h4>
          <img
            src={uploadedUrl}
            alt="uploaded"
            style={{ width: 200, border: "1px solid #ccc" }}
          />
          <p>URL: {uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}
