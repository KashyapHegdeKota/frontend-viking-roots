import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, User } from 'lucide-react';
import '../styles/ProfileSetup.css';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please select a JPEG, PNG, or WebP image.');
        return;
      }

      // Validate file size (5MB max for profile pictures)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrorMessage('File is too large. Maximum size is 5MB.');
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
      const syntheticEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(syntheticEvent);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Please select a profile picture to upload.');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('profile_picture', selectedFile);
      formData.append('bio', bio);
      formData.append('location', location);
      formData.append('website', website);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/form/profile/upload/`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully uploaded profile picture
        alert('Profile picture uploaded successfully!');
        // Navigate to user profile page
        navigate(`/profile/${data.profile.username}`);
      } else {
        setErrorMessage(data.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection and try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-content">
        <div className="header-section">
          <h1 className="setup-title">Complete Your Profile</h1>
          <p className="setup-subtitle">Upload a profile picture to get started with Viking Roots social features</p>
        </div>

        <form onSubmit={handleUpload} className="setup-form">
          {/* Profile Picture Upload */}
          <div
            className={`profile-drop-zone ${selectedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="file-input"
            />

            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Profile Preview" className="profile-preview-image" />
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
                <div className="avatar-placeholder">
                  <User size={64} />
                </div>
                <p className="drop-zone-text">Click to upload profile picture</p>
                <p className="drop-zone-subtext">or drag and drop</p>
                <p className="drop-zone-formats">JPEG, PNG, WebP (Max 5MB)</p>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="profile-info-section">
            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="form-textarea"
                maxLength={500}
              />
              <span className="char-count">{bio.length}/500</span>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, USA"
                className="form-input"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website" className="form-label">
                Website (Optional)
              </label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="form-input"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              <X size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={uploading || !selectedFile}
          >
            {uploading ? (
              <>
                <span className="spinner" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Complete Profile Setup
              </>
            )}
          </button>

          <p className="required-note">
            * Profile picture is required to access social features
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
