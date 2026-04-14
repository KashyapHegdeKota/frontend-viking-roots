import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

export function FaceEnrollment() {
  const [status, setStatus] = useState<{ is_enrolled: boolean; face_count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.RECOGNITION_STATUS, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setStatus(data);
    } catch (err) {
      console.error('Error fetching enrollment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        alert('Please select a maximum of 5 photos.');
        return;
      }
      setSelectedFiles(files);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));

    try {
      const res = await fetch(API_ENDPOINTS.RECOGNITION_ENROLL, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Enrollment successful!');
        fetchStatus();
        setSelectedFiles([]);
      } else {
        setMessage(data.error || 'Enrollment failed.');
      }
    } catch (err) {
      setMessage('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your biometric face data? This will disable face tagging suggestions for you.')) return;

    try {
      const res = await fetch(API_ENDPOINTS.RECOGNITION_DELETE, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setMessage('Biometric data deleted.');
        fetchStatus();
      }
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  if (loading) return <div className="animate-pulse h-24 bg-[#171717] rounded-xl" />;

  return (
    <div className="rounded-xl border border-[#262626] bg-[#171717] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Face Enrollment</h3>
          <p className="text-sm text-white/50">Help Viking Roots recognize you in photos shared by friends.</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${status?.is_enrolled ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
          {status?.is_enrolled ? 'Enrolled' : 'Not Enrolled'}
        </div>
      </div>

      {status?.is_enrolled ? (
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            You have {status.face_count} face samples stored securely in AWS Rekognition.
          </p>
          <button 
            onClick={handleDelete}
            className="text-xs font-semibold text-red-500 hover:underline"
          >
            Delete biometric data
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-[#262626] p-8 text-center transition-colors hover:border-[#c88a65]/40">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="face-upload"
            />
            <label htmlFor="face-upload" className="cursor-pointer">
              <svg className="mx-auto mb-3 h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-white/70">
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} files selected` 
                  : 'Click to upload 3-5 clear photos of your face'}
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={uploading || selectedFiles.length === 0}
            className="w-full rounded-lg bg-[linear-gradient(to_right,#c88a65_-55%,white)] py-2 text-sm font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {uploading ? 'Processing...' : 'Complete Enrollment'}
          </button>
        </form>
      )}

      {message && <p className={`mt-4 text-center text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
    </div>
  );
}
