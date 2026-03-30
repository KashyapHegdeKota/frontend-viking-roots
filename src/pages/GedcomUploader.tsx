// src/components/GedcomUploader.tsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, Download, ChevronDown, ExternalLink } from 'lucide-react';
import '../styles/ProfileSetup.css';

const GedcomUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
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

        {/* Export Section */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '18px', color: '#111' }}>Export Your Data</h3>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Export your family tree or upload DNA data to external services.
          </p>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
              >
                <Download size={18} />
                Export GEDCOM
                <ChevronDown size={16} style={{ transform: showExportDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showExportDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '260px',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={async () => {
                      setShowExportDropdown(false);
                      try {
                        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                        const response = await fetch(`${apiBaseUrl}/api/heritage/export-gedcom/`, {
                          credentials: 'include',
                        });
                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'family_tree.ged';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        } else {
                          alert('Export failed. Please try again.');
                        }
                      } catch {
                        alert('Network error. Please try again.');
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '14px 18px',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Download size={18} color="#6b7280" />
                    <div>
                      <div>Download .GED File</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Save to your computer</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExportDropdown(false);
                      window.open('https://app.gedmatch.com/dnaupload/', '_blank', 'noopener,noreferrer');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '14px 18px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <ExternalLink size={18} color="#8b5cf6" />
                    <div>
                      <div>Export to GEDmatch</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Upload DNA data to gedmatch.com</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GedcomUploader;