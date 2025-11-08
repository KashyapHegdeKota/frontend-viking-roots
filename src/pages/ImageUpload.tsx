import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import '../styles/ImageUpload.css';

interface UploadedImage {
  id: number;
  url: string;
  title: string;
  description: string;
  file_size: number;
  uploaded_at: string;
}

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrorMessage('File is too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      setErrorMessage('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse the handleFileSelect logic
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(syntheticEvent);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Please select an image to upload.');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', title);
      formData.append('description', description);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/form/upload-image/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('success');
        setUploadedImage(data.image);
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setTitle('');
        setDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadStatus('error');
        setErrorMessage(data.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setUploadStatus('idle');
    setUploadedImage(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <div className="upload-content">
        <h1 className="upload-title">Upload Image to S3</h1>
        <p className="upload-subtitle">Upload your images securely to Amazon S3</p>

        <form onSubmit={handleUpload} className="upload-form">
          {/* File Drop Zone */}
          <div
            className={`drop-zone ${selectedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="file-input"
            />

            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="remove-button"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="drop-zone-content">
                <Upload size={48} className="upload-icon" />
                <p className="drop-zone-text">Drag and drop an image here</p>
                <p className="drop-zone-subtext">or click to browse</p>
                <p className="drop-zone-formats">JPEG, PNG, GIF, WebP (Max 10MB)</p>
              </div>
            )}
          </div>

          {/* Image Metadata */}
          {selectedFile && (
            <div className="metadata-section">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter image description"
                  rows={3}
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              <X size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Button */}
          {selectedFile && (
            <div className="button-group">
              <button
                type="button"
                onClick={handleReset}
                className="button button-secondary"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button-primary"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Success Message */}
        {uploadStatus === 'success' && uploadedImage && (
          <div className="success-card">
            <div className="success-header">
              <CheckCircle size={24} className="success-icon" />
              <h2>Upload Successful!</h2>
            </div>
            <div className="uploaded-image-details">
              <img src={uploadedImage.url} alt={uploadedImage.title} className="uploaded-thumbnail" />
              <div className="uploaded-info">
                <p><strong>Title:</strong> {uploadedImage.title || 'Untitled'}</p>
                <p><strong>Description:</strong> {uploadedImage.description || 'No description'}</p>
                <p><strong>Size:</strong> {(uploadedImage.file_size / 1024).toFixed(2)} KB</p>
                <p className="image-url">
                  <strong>URL:</strong>
                  <a href={uploadedImage.url} target="_blank" rel="noopener noreferrer">
                    {uploadedImage.url}
                  </a>
                </p>
              </div>
            </div>
            <button onClick={handleReset} className="button button-primary">
              <ImageIcon size={20} />
              Upload Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
