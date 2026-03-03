// src/pages/HeritageDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Edit2, MapPin, X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'timeline' | 'tree'>('timeline');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Your Saga...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Header Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '2px solid #e5e5e5' }}>
        <button 
          onClick={() => setActiveTab('timeline')}
          style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'timeline' ? '3px solid #8b5cf6' : 'none', fontWeight: activeTab === 'timeline' ? 'bold' : 'normal' }}
        >
          <Calendar size={18} style={{ marginRight: '8px' }} /> Timeline
        </button>
        <button 
          onClick={() => setActiveTab('tree')}
          style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'tree' ? '3px solid #8b5cf6' : 'none', fontWeight: activeTab === 'tree' ? 'bold' : 'normal' }}
        >
          <Users size={18} style={{ marginRight: '8px' }} /> Family Tree
        </button>
      </div>

      {/* TIMELINE VIEW (Sponsor Requirement) */}
      {activeTab === 'timeline' && (
        <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '20px' }}>
          {timeline.length === 0 ? <p>No events found. Start the questionnaire to build your saga.</p> : null}
          {timeline.map((event, idx) => (
            <div key={idx} style={{ marginBottom: '25px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-26px', top: '5px', width: '12px', height: '12px', background: '#fff', border: '3px solid #8b5cf6', borderRadius: '50%' }} />
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#111' }}>{event.year}</div>
              <div style={{ fontSize: '1.1rem', marginTop: '5px' }}>{event.title}</div>
              {event.description && <div style={{ color: '#666', marginTop: '5px' }}>{event.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* FAMILY TREE VIEW (Ancestor Cards) */}
      {activeTab === 'tree' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {ancestors.map(anc => (
            <div key={anc.id} style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '15px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{anc.name}</h3>
                <button onClick={() => setEditingAncestor(anc)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Edit2 size={16} color="#666" /></button>
              </div>
              
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}><strong>{anc.relation}</strong></div>
              
              {anc.origin && (
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} /> {anc.origin}
                </div>
              )}
              
              <div style={{ marginTop: '10px', fontSize: '13px' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Edit Ancestor</h2>
              <button onClick={() => setEditingAncestor(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            
            <form onSubmit={saveAncestor}>
              <div style={{ marginBottom: '15px' }}>
                <label>Full Name</label>
                <input name="name" value={editingAncestor.name} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Relation to You</label>
                <input name="relation" value={editingAncestor.relation} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Birth Year</label>
                  <input type="number" name="birth_year" value={editingAncestor.birth_year || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Death Year</label>
                  <input type="number" name="death_year" value={editingAncestor.death_year || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <button type="button" onClick={() => deleteAncestor(editingAncestor.id)} style={{ padding: '10px 15px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageDashboard;