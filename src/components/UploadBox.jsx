import { useState } from 'react';
import './UploadBox.css';

function UploadBox({ onFileChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        if (onFileChange) {
          onFileChange(selectedFile);
        }
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        if (onFileChange) {
          onFileChange(selectedFile);
        }
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  return (
    <div
      className={`upload-box ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="upload-icon">📄</div>
      <h3>Drag and drop your resume here</h3>
      <p>or</p>
      <label className="file-input-label">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="file-input"
        />
        <span className="choose-file-btn">Choose File</span>
      </label>
      <p className="file-info">PDF format, max 10MB</p>
      {file && <p className="file-name">✓ {file.name}</p>}
    </div>
  );
}

export default UploadBox;