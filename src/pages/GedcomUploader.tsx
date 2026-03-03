// src/pages/GedcomUploader.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, CheckCircle, ArrowLeft } from 'lucide-react';
import '../styles/ProfileSetup.css';

const GedcomUploader: React.FC = () => {
  const navigate = useNavigate();
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
      // FIXED: Repointed to the new heritage micro-app route
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Top Navigation */}
        <button 
          onClick={() => navigate('/profile')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            background: 'none', border: 'none', color: '#666', 
            cursor: 'pointer', padding: '0 0 20px 0', 
            fontSize: '14px', fontWeight: 500 
          }}
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>

        <div className="profile-setup-content" style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e5e5', 
          borderRadius: '12px', 
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', color: '#111', fontSize: '24px' }}>Import Family Tree</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Upload a GEDCOM (.ged) file to instantly populate your heritage data.</p>
          
          <form onSubmit={handleUpload} className="setup-form">
            <div 
              className={`profile-drop-zone ${selectedFile ? 'has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${selectedFile ? '#8b5cf6' : '#ccc'}`,
                backgroundColor: selectedFile ? '#f3e8ff' : '#fafafa',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
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
                  <FileText size={48} color="#8b5cf6" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '15px', fontWeight: '600', color: '#111' }}>{selectedFile.name}</p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div className="drop-zone-content">
                  <Upload size={48} color="#999" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '15px', color: '#111', fontWeight: 500 }}>Click to select GEDCOM file</p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Only .ged formats supported</p>
                </div>
              )}
            </div>

            {message && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px',
                color: message.type === 'error' ? '#dc2626' : '#16a34a',
                backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500
              }}>
                {message.type === 'error' ? <X size={20} /> : <CheckCircle size={20} />}
                <span>{message.text}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || !selectedFile} 
              style={{ 
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: (uploading || !selectedFile) ? '#e5e5e5' : '#111',
                color: (uploading || !selectedFile) ? '#999' : '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: (uploading || !selectedFile) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {uploading ? 'Processing Data...' : 'Import Data'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GedcomUploader;