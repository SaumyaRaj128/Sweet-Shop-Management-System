import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Edit, Trash2, Package, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function SweetCard({ sweet, onUpdate, onDelete, onPurchase, variant = 'card' }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) return alert('Please login to purchase');
    setLoading(true);
    try {
        await api.post(`/sweets/${sweet._id}/purchase`, { quantity: 1 });
        if (onPurchase) onPurchase(); // Refresh data
    } catch (error) {
        alert(error.response?.data?.message || 'Purchase failed');
    } finally {
        setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (variant === 'actions') {
    return (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {!isAdmin && (
            <button 
                onClick={handlePurchase} 
                disabled={loading || sweet.quantity === 0} 
                className="btn btn-primary" 
                style={{ padding: '0.5rem' }}
                title="Buy Now"
            >
                <ShoppingCart size={18} />
            </button>
        )}

        {isAdmin && (
            <>
                <button onClick={() => onUpdate(sweet)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    <Edit size={18} />
                </button>
                <button onClick={() => onDelete(sweet._id)} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: '#fca5a5' }}>
                    <Trash2 size={18} />
                </button>
            </>
        )}
      </div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}
    >
      {sweet.image && (
        <div style={{ margin: '-1.5rem -1.5rem 1rem -1.5rem' }}>
            <img 
                src={sweet.image} 
                alt={sweet.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
        </div>
      )}
      
      <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{sweet.name}</h3>
            <span style={{ 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--primary)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                fontWeight: '600',
                textTransform: 'uppercase'
            }}>
                {sweet.category}
            </span>
        </div>
        {(isAdmin && sweet.soldQuantity > 0) && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <TrendingUp size={14} className="text-green-500" />
                <span>{sweet.soldQuantity} sold</span>
             </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{sweet.price}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: sweet.quantity > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '500', fontSize: '0.875rem' }}>
                <Package size={16} />
                <span>{sweet.quantity > 0 ? `${sweet.quantity} left` : 'Out of Stock'}</span>
            </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        {!isAdmin && (
            <button 
                onClick={handlePurchase} 
                disabled={loading || sweet.quantity === 0} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
            >
                <ShoppingCart size={18} />
                {loading ? '...' : sweet.quantity === 0 ? 'Sold Out' : 'Buy Now'}
            </button>
        )}

        {isAdmin && (
            <>
                <button onClick={() => onUpdate(sweet)} className="btn btn-secondary" style={{ padding: '0.75rem', flex: 1 }}>
                    <Edit size={18} />
                    Edit
                </button>
                <button onClick={() => onDelete(sweet._id)} className="btn btn-secondary" style={{ padding: '0.75rem', flex: 1, color: 'var(--danger)', borderColor: '#fca5a5' }}>
                    <Trash2 size={18} />
                    Delete
                </button>
            </>
        )}
      </div>
    </motion.div>
  );
}
