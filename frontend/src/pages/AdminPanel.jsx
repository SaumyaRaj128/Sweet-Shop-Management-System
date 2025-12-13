import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PackagePlus } from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
        setImageFile(files ? files[0] : null);
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      await api.post('/sweets', data);
      setMessage({ type: 'success', text: 'Sweet added successfully!' });
      setFormData({ name: '', category: '', price: '', quantity: '' }); // Reset form
      setImageFile(null);
      setTimeout(() => navigate('/'), 1500); // Redirect to dashboard
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add sweet' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: '50%', color: 'var(--primary)' }}>
            <PackagePlus size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Add New Sweet</h1>
            <p style={{ color: 'var(--text-muted)' }}>Expand your inventory</p>
          </div>
        </div>

        {message.text && (
            <div style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem', 
                backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: message.type === 'success' ? '#166534' : '#b91c1c'
            }}>
                {message.text}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
                <label className="text-sm font-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>Sweet Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="input" placeholder="e.g. Strawberry Cupcake" />
            </div>
            
            <div>
                <label className="text-sm font-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>Category</label>
                <input required name="category" value={formData.category} onChange={handleChange} className="input" placeholder="e.g. Cupcake" />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="text-sm font-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>Price (₹)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="input" min="0" step="0.01" placeholder="0.00" />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="text-sm font-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>Initial Quantity</label>
                    <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input" min="0" placeholder="0" />
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>Image</label>
                <input type="file" name="image" onChange={handleChange} className="input" accept="image/*" />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {loading ? 'Adding...' : 'Add to Inventory'}
            </button>
        </form>
      </div>
    </div>
  );
}
