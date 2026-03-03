// src/pages/HeritageDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Edit2, MapPin, X, Download, ListTree, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
  type: string;
}

interface Ancestor {
  id: string;
  name: string;
  relation: string;
  birth_year: number | null;
  death_year: number | null;
  origin: string;
  photos: { url: string; title: string }[];
}

const HeritageDashboard: React.FC = () => {
  const navigate = useNavigate();
  // We now have 3 tabs: timeline, tree (visual), and manage (card grid)
  const [activeTab, setActiveTab] = useState<'timeline' | 'tree' | 'manage'>('timeline');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [editingAncestor, setEditingAncestor] = useState<Ancestor | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [timelineRes, treeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/heritage/timeline/`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/heritage/tree/`, { credentials: 'include' })
      ]);
      const [timelineData, treeData] = await Promise.all([timelineRes.json(), treeRes.json()]);

      setTimeline(timelineData.timeline || []);
      setAncestors(treeData.tree || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingAncestor) {
      setEditingAncestor({ ...editingAncestor, [e.target.name]: e.target.value });
    }
  };

  const saveAncestor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAncestor) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/heritage/ancestor/${editingAncestor.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editingAncestor.name,
          relation: editingAncestor.relation,
          birth_year: editingAncestor.birth_year ? parseInt(editingAncestor.birth_year.toString()) : null,
          death_year: editingAncestor.death_year ? parseInt(editingAncestor.death_year.toString()) : null,
          origin: editingAncestor.origin,
        })
      });

      if (response.ok) {
        setEditingAncestor(null);
        fetchData(); // Refresh Data
      }
    } catch (error) {
      console.error('Failed to update ancestor', error);
    }
  };

  const deleteAncestor = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this ancestor?")) return;

    try {
      await fetch(`${API_BASE_URL}/api/heritage/ancestor/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchData();
    } catch (error) {
      console.error("Failed to delete ancestor", error);
    }
  };

  const exportGedcom = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/heritage/export-gedcom/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to export GEDCOM');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'VikingRoots_Export.ged';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting GEDCOM:', error);
      alert('Failed to export your family tree. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Loading Your Saga...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Top Navigation */}
      <button 
        onClick={() => navigate('/profile')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '0 0 20px 0', fontSize: '14px', fontWeight: 500 }}
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      {/* Header Tabs & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e5e5e5', paddingBottom: '10px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('timeline')}
            style={{ padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'timeline' ? '3px solid #8b5cf6' : 'none', fontWeight: activeTab === 'timeline' ? 'bold' : 'normal', color: activeTab === 'timeline' ? '#111' : '#666', whiteSpace: 'nowrap' }}
          >
            <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Timeline
          </button>
          <button 
            onClick={() => setActiveTab('tree')}
            style={{ padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'tree' ? '3px solid #8b5cf6' : 'none', fontWeight: activeTab === 'tree' ? 'bold' : 'normal', color: activeTab === 'tree' ? '#111' : '#666', whiteSpace: 'nowrap' }}
          >
            <ListTree size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Family Tree
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            style={{ padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'manage' ? '3px solid #8b5cf6' : 'none', fontWeight: activeTab === 'manage' ? 'bold' : 'normal', color: activeTab === 'manage' ? '#111' : '#666', whiteSpace: 'nowrap' }}
          >
            <Users size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Manage Family
          </button>
        </div>

        {/* EXPORT BUTTON */}
        <button
          onClick={exportGedcom}
          disabled={isExporting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            color: '#111',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            cursor: isExporting ? 'wait' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            opacity: isExporting ? 0.7 : 1,
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export .GED'}
        </button>
      </div>

      {/* TIMELINE VIEW */}
      {activeTab === 'timeline' && (
        <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '20px' }}>
          {timeline.length === 0 ? <p style={{ color: '#666' }}>No events found. Start the questionnaire to build your saga.</p> : null}
          {timeline.map((event, idx) => (
            <div key={idx} style={{ marginBottom: '25px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-26px', top: '5px', width: '12px', height: '12px', background: '#fff', border: '3px solid #8b5cf6', borderRadius: '50%' }} />
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#111' }}>{event.year}</div>
              <div style={{ fontSize: '1.1rem', marginTop: '5px', color: '#111' }}>{event.title}</div>
              {event.description && <div style={{ color: '#666', marginTop: '5px' }}>{event.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* VISUAL TREE VIEW (Blank for now) */}
      {activeTab === 'tree' && (
        <div style={{ 
          height: '60vh', 
          backgroundColor: '#f9fafb', 
          border: '1px dashed #ccc', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#666'
        }}>
          <ListTree size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#111' }}>Visual Family Tree</h3>
          <p style={{ margin: 0 }}>Interactive node graph coming soon.</p>
        </div>
      )}

      {/* MANAGE FAMILY VIEW (The Card Grid) */}
      {activeTab === 'manage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {ancestors.length === 0 ? <p style={{ color: '#666', gridColumn: '1 / -1' }}>No family members found yet.</p> : null}
          {ancestors.map(anc => (
            <div key={anc.id} style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '15px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#111' }}>{anc.name}</h3>
                <button onClick={() => setEditingAncestor(anc)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><Edit2 size={16} color="#666" /></button>
              </div>
              
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}><strong>{anc.relation}</strong></div>
              
              {anc.origin && (
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} /> {anc.origin}
                </div>
              )}
              
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#111' }}>
                {anc.birth_year ? `b. ${anc.birth_year}` : 'b. Unknown'} - {anc.death_year ? `d. ${anc.death_year}` : 'd. Unknown'}
              </div>
              
              {anc.photos.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <img src={anc.photos[0].url} alt={anc.photos[0].title || 'Ancestor Photo'} style={{ width: '100%', borderRadius: '8px', maxHeight: '150px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL (#161) */}
      {editingAncestor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#111' }}>Edit Ancestor</h2>
              <button onClick={() => setEditingAncestor(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X color="#666" /></button>
            </div>
            
            <form onSubmit={saveAncestor}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#111', fontSize: '14px', fontWeight: 500 }}>Full Name</label>
                <input name="name" value={editingAncestor.name} onChange={handleEditChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#111', fontSize: '14px', fontWeight: 500 }}>Relation to You</label>
                <input name="relation" value={editingAncestor.relation} onChange={handleEditChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#111', fontSize: '14px', fontWeight: 500 }}>Birth Year</label>
                  <input type="number" name="birth_year" value={editingAncestor.birth_year || ''} onChange={handleEditChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#111', fontSize: '14px', fontWeight: 500 }}>Death Year</label>
                  <input type="number" name="death_year" value={editingAncestor.death_year || ''} onChange={handleEditChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <button type="button" onClick={() => deleteAncestor(editingAncestor.id)} style={{ padding: '10px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageDashboard;