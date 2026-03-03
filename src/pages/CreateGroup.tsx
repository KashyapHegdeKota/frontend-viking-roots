import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './components/Login.css';

const API_ENDPOINTS = {
    // Updated to point to the 'form' app URLs correctly
    // Assuming VITE_API_BASE_URL ends with a slash (http://127.0.0.1:8000/)
    CREATE_GROUP: `${import.meta.env.VITE_API_BASE_URL}form/groups/create/`,
    REGISTER: `${import.meta.env.VITE_API_BASE_URL}form/register/`,
};

// Helper function to get CSRF token from cookies
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REGISTER.replace('/form/register/', '/form/profile/')}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUsername(data.profile.username);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('is_public', isPublic.toString());
      if (image) {
        formData.append('image', image);
      }

      // Get CSRF token
      const csrftoken = getCookie('csrftoken');

      const response = await fetch(API_ENDPOINTS.CREATE_GROUP, {
        method: 'POST',
        credentials: 'include',
        headers: {
          // Add CSRF token header
          'X-CSRFToken': csrftoken || '',
        },
        body: formData,
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          navigate(`/group/${data.group.id}`);
        } else {
          setError(data.error || 'Failed to create group');
        }
      } else {
        // Handle non-JSON errors (like 403 Forbidden HTML pages)
        const text = await response.text();
        console.error('Server Error:', text);
        setError(`Server error: ${response.status} ${response.statusText}`);
      }

    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error creating group:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentUsername) {
      navigate(`/groups/${currentUsername}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="login-section d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-box p-5" style={{ maxWidth: '600px', width: '95%' }}>
        
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button 
            onClick={handleBack}
            className="btn btn-link text-dark p-0 me-3"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="fw-bold m-0">Create New Group</h2>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Image Upload */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div 
              onClick={() => document.getElementById('group-image-input')?.click()}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '32px', color: '#adb5bd' }}>+</span>
              )}
              <input
                id="group-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <small className="text-muted mt-2">Add Group Photo</small>
          </div>

          {/* Name Input */}
          <div className="mb-3">
            <label className="form-label mb-2 fw-bold">Group Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Northern Clan"
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-3">
            <label className="form-label mb-2 fw-bold">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about?"
              rows={4}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Privacy Toggle */}
          <div 
            className="mb-4 p-3 border rounded d-flex align-items-center justify-content-between cursor-pointer bg-light"
            onClick={() => setIsPublic(!isPublic)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="fw-bold">{isPublic ? 'Public Group' : 'Private Group'}</div>
              <small className="text-muted">
                {isPublic ? 'Anyone can find and join' : 'Only invited members can join'}
              </small>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={isPublic}
                onChange={() => {}} // Handled by parent div click
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-custom w-100"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
