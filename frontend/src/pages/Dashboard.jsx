import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import SweetCard from '../components/SweetCard';
import SweetForm from '../components/SweetForm';
import { Search, Loader } from 'lucide-react';
import sweetImage from '../assets/colorful-indian-sweets-plate-assorted-vibrant-colors-including-pink-orange-hues-363530951.webp';

export default function Dashboard() {
  const { user } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [editingSweet, setEditingSweet] = useState(null);
  
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
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '600px', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '200px' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Search by name or category..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="Min ₹" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ minWidth: '80px' }}
                />
                <input 
                  type="number" 
                  className="input" 
                  placeholder="Max ₹" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ minWidth: '80px' }}
                />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
              <Search size={20} />
            </button>
          </form>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {sweets.map(sweet => (
                <SweetCard 
                    key={sweet._id} 
                    sweet={sweet} 
                    onPurchase={() => fetchSweets(search)} 
                    onUpdate={(sweetToEdit) => setEditingSweet(sweetToEdit)} 
                    onDelete={async (id) => {
                         if (!confirm('Are you sure you want to delete this sweet?')) return;
                         try {
                            await api.delete(`/sweets/${id}`);
                            fetchSweets(search);
                         } catch (err) {
                            alert('Failed to delete');
                         }
                    }}
                />
              ))}
            </div>
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
    </div>
  );
}
