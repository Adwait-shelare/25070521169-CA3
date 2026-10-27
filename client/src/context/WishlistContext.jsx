import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [wishlistTourIds, setWishlistTourIds] = useState([]);
  const [wishlistTours, setWishlistTours] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistTourIds([]);
        setWishlistTours([]);
        return;
      }
      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setWishlistTourIds(res.data.tourIds || []);
          setWishlistTours(res.data.tours || []);
        }
      } catch (error) {
        console.error('[WishlistContext] Fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Toggle wishlist item
  const toggleWishlist = async (tour) => {
    if (!user) {
      addToast('Please log in to save expeditions to your wishlist.', 'info');
      return false;
    }

    const tourId = tour._id || tour;

    try {
      const res = await api.post('/wishlist/toggle', { tourId });
      if (res.data.success) {
        setWishlistTourIds(res.data.tourIds);
        addToast(res.data.message, 'success');

        // Refresh full objects if needed
        if (res.data.isWishlisted && typeof tour === 'object') {
          setWishlistTours((prev) => [...prev, tour]);
        } else {
          setWishlistTours((prev) => prev.filter((t) => (t._id || t) !== tourId));
        }

        return res.data.isWishlisted;
      }
    } catch (error) {
      addToast('Failed to update wishlist.', 'error');
      return false;
    }
  };

  const isWishlisted = (tourId) => {
    return wishlistTourIds.includes(tourId?.toString());
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistTourIds,
        wishlistTours,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistTourIds.length,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
