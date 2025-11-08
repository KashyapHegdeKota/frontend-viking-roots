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

  // single source of truth for file validation and preview
  const validateAndPreview = (file: File) => {
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

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) validateAndPreview(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) validateAndPreview(file);
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
        if (fileInputRef.current) fileInputRef.current.value = '';
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="image-upload-container">
      {/* ... the rest of your JSX stays the same ... */}
    </div>
  );
};

export default ImageUpload;
