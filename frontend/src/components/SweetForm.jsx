import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SweetForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        quantity: initialData.quantity
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onCancel} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent' }}>
            <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            {initialData ? 'Update Sweet' : 'Add New Sweet'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label className="text-sm font-semibold">Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="input" />
            </div>
            <div>
                <label className="text-sm font-semibold">Category</label>
                <input required name="category" value={formData.category} onChange={handleChange} className="input" placeholder="e.g. Chocolate, Pastry" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="text-sm font-semibold">Price (₹)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="input" min="0" step="0.01" />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="text-sm font-semibold">Quantity</label>
                    <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input" min="0" />
                </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {initialData ? 'Update Sweet' : 'Add Sweet'}
            </button>
        </form>
      </div>
    </div>
  );
}
