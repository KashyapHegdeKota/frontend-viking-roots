// src/components/GedcomUploader.tsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import '../styles/ProfileSetup.css';

const GedcomUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.ged')) {
        setMessage({ type: 'error', text: 'Invalid file type. Please upload a .ged file.' });
        return;
      }
      setSelectedFile(file);
      setMessage(null);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/heritage/upload-gedcom/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-setup-container" style={{ padding: '20px' }}>
      <div className="profile-setup-content">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Import Family Tree</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Upload a GEDCOM (.ged) file to instantly populate your heritage data.</p>
        
        <form onSubmit={handleUpload} className="setup-form">
          <div 
            className={`profile-drop-zone ${selectedFile ? 'has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".ged"
              className="file-input"
              style={{ display: 'none' }}
            />
            
            {selectedFile ? (
              <div className="drop-zone-content">
                <FileText size={48} color="#8b5cf6" />
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{selectedFile.name}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="drop-zone-content">
                <Upload size={48} color="#666" />
                <p className="drop-zone-text">Click to select GEDCOM file</p>
                <p className="drop-zone-formats">Only .ged formats supported</p>
              </div>
            )}
          </div>

          {message && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px',
              color: message.type === 'error' ? '#dc2626' : '#16a34a',
              backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
              padding: '10px', borderRadius: '8px'
            }}>
              {message.type === 'error' ? <X size={20} /> : <CheckCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={uploading || !selectedFile} style={{ marginTop: '20px' }}>
            {uploading ? 'Processing...' : 'Import Data'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GedcomUploader;