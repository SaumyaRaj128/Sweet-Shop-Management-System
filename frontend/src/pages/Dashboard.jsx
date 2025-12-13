import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import SweetCard from '../components/SweetCard';
import SweetForm from '../components/SweetForm';
import { Search, Loader, Grid, List } from 'lucide-react';
import sweetImage from '../assets/colorful-indian-sweets-plate-assorted-vibrant-colors-including-pink-orange-hues-363530951.webp';

export default function Dashboard() {
  const { user } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [editingSweet, setEditingSweet] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sweetToDelete, setSweetToDelete] = useState(null);
  
  const fetchSweets = async (query = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const endpoint = params.toString() ? `/sweets/search?${params.toString()}` : '/sweets';
      const { data } = await api.get(endpoint);
      setSweets(data);
    } catch (error) {
      console.error("Failed to fetch sweets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!sweetToDelete) return;
    try {
        await api.delete(`/sweets/${sweetToDelete}`);
        setSweetToDelete(null);
        fetchSweets(search);
    } catch (err) {
        alert('Failed to delete');
    }
  };

  useEffect(() => {
    if (user) {
      fetchSweets();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSweets(search);
  };

  const handleUpdate = async (formData) => {
    try {
        await api.put(`/sweets/${editingSweet._id}`, formData);
        setEditingSweet(null);
        fetchSweets(search);
    } catch (error) {
        alert(error.response?.data?.message || 'Update failed');
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>Delicious Sweets Await!</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Login to browse our exclusive collection of hand-crafted sweets.</p>
        <img src={sweetImage} alt="Sweets" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>Our Sweets</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`btn ${viewMode === 'grid' ? 'btn-white shadow-sm' : ''}`}
                    style={{ padding: '0.5rem', background: viewMode === 'grid' ? 'white' : 'transparent', border: 'none' }}
                >
                    <Grid size={20} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`btn ${viewMode === 'list' ? 'btn-white shadow-sm' : ''}`}
                    style={{ padding: '0.5rem', background: viewMode === 'list' ? 'white' : 'transparent', border: 'none' }}
                >
                    <List size={20} />
                </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '600px', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '150px' }}>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Search..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <input 
                      type="number" 
                      className="input" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      style={{ minWidth: '70px' }}
                    />
                    <input 
                      type="number" 
                      className="input" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      style={{ minWidth: '70px' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                  <Search size={20} />
                </button>
            </form>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader className="animate-spin" size={40} color="var(--primary)" />
        </div>
      ) : (
        <>
          {sweets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <p>No sweets found. Try a different search.</p>
            </div>
          ) : (
            <>
                {viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                      {sweets.map(sweet => (
                        <SweetCard 
                            key={sweet._id} 
                            sweet={sweet} 
                            onPurchase={() => fetchSweets(search)} 
                            onUpdate={(sweetToEdit) => setEditingSweet(sweetToEdit)} 
                            onDelete={(id) => setSweetToDelete(id)}
                        />
                      ))}
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>Image</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>Category</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>Stock</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>Sold</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: '#6b7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sweets.map(sweet => (
                                    <tr key={sweet._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem' }}>
                                            {sweet.image ? (
                                                <img src={sweet.image} alt={sweet.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#e5e7eb' }} />
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{sweet.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                backgroundColor: 'var(--secondary)', 
                                                color: 'var(--primary)', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '8px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '600'
                                            }}>
                                                {sweet.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 700 }}>₹{sweet.price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ color: sweet.quantity > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
                                                {sweet.quantity} left
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#6b7280' }}>{sweet.soldQuantity || 0}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <SweetCard 
                                                sweet={sweet} 
                                                onPurchase={() => fetchSweets(search)} 
                                                onUpdate={(sweetToEdit) => setEditingSweet(sweetToEdit)} 
                                                onDelete={(id) => setSweetToDelete(id)}
                                                variant="actions"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
          )}
        </>
      )}

      {editingSweet && (
        <SweetForm 
            initialData={editingSweet} 
            onSubmit={handleUpdate} 
            onCancel={() => setEditingSweet(null)} 
        />
      )}
      {sweetToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Confirm Delete</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Are you sure you want to remove this sweet from your inventory? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => setSweetToDelete(null)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleDeleteConfirm} className="btn btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
