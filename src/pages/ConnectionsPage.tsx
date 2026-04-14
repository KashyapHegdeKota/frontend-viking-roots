import { useEffect, useState } from "react";

import { API_ENDPOINTS } from "../config/api";

interface UserInfo {
  id: number;
  username: string;
  profile_picture_url: string | null;
  full_name?: string;
  connection_id?: number;
}

export default function ConnectionsPage() {
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.CONNECTIONS, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setFriends(data.friends || []);
        setRequests(data.requests_received || []);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.users || []);
      }
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.SEND_CONNECTION_REQUEST(userId), {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        alert('Connection request sent!');
        setSearchResults(prev => prev.filter(u => u.id !== userId));
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  const handleAcceptRequest = async (connectionId: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.ACCEPT_CONNECTION_REQUEST(connectionId), {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        // Refresh the lists
        fetchConnections();
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <div className="mx-auto flex w-full max-w-7xl flex-1">

        
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8">Family Connections</h1>

            <div className="space-y-8">
              
              {/* Search Section */}
              <section className="rounded-xl border border-[#262626] bg-[#171717] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Find Family & Friends</h2>
                <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username or name..."
                    className="flex-1 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-[#c88a65]"
                  />
                  <button 
                    type="submit"
                    disabled={searching || !searchQuery.trim()}
                    className="rounded-lg bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-6 py-2 font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white disabled:opacity-50"
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Results</h3>
                    {searchResults.map(user => (
                      <div key={user.id} className="flex items-center justify-between rounded-lg border border-[#262626] p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#262626] overflow-hidden flex items-center justify-center text-[#c88a65] font-bold">
                            {user.profile_picture_url ? (
                              <img src={user.profile_picture_url} alt={user.username} className="h-full w-full object-cover" />
                            ) : (
                              user.username[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white">{user.username}</p>
                            {user.full_name && <p className="text-xs text-white/50">{user.full_name}</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSendRequest(user.id)}
                          className="rounded bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-3 py-1 text-xs font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white"
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Pending Requests Section */}
              {requests.length > 0 && (
                <section className="rounded-xl border border-[#262626] bg-[#171717] p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Pending Requests</h2>
                  <div className="space-y-3">
                    {requests.map(req => (
                      <div key={req.connection_id} className="flex items-center justify-between rounded-lg border border-[#262626] p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#262626] overflow-hidden flex items-center justify-center text-[#c88a65] font-bold">
                            {req.profile_picture_url ? (
                              <img src={req.profile_picture_url} alt={req.username} className="h-full w-full object-cover" />
                            ) : (
                              req.username[0].toUpperCase()
                            )}
                          </div>
                          <p className="font-bold text-white">{req.username}</p>
                        </div>
                        <button 
                          onClick={() => handleAcceptRequest(req.connection_id!)}
                          className="rounded bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-4 py-1.5 text-xs font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white hover:scale-105"
                        >
                          Accept
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Current Connections Section */}
              <section className="rounded-xl border border-[#262626] bg-[#171717] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Your Connections</h2>
                {loading ? (
                  <div className="animate-pulse h-12 bg-[#262626] rounded-lg" />
                ) : friends.length === 0 ? (
                  <p className="text-white/50 text-center py-4">You haven't added any family connections yet.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {friends.map(friend => (
                      <div key={friend.id} className="flex items-center gap-3 rounded-lg border border-[#262626] p-3">
                        <div className="h-10 w-10 rounded-full bg-[#262626] overflow-hidden flex items-center justify-center text-[#c88a65] font-bold">
                          {friend.profile_picture_url ? (
                            <img src={friend.profile_picture_url} alt={friend.username} className="h-full w-full object-cover" />
                          ) : (
                            friend.username[0].toUpperCase()
                          )}
                        </div>
                        <p className="font-bold text-white truncate">{friend.username}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
