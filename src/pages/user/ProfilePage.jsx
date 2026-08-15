import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Shield, Star, Award, Clock, Settings, PackageCheck, Camera, Trash2, Check, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { UserAvatar } from '../../components/common/UserAvatar';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile Photo Upload states
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const userOrders = await orderService.getUserOrders();
        setOrders(userOrders || []);
      } catch (err) {
        console.error('Failed to load user orders for profile stats:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  const ordersCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.summary?.total || o.totalAmount || 0), 0);
  const cravePoints = Math.floor(totalSpent);

  const getMemberTier = () => {
    if (ordersCount === 0) return 'New Crave Member';
    if (ordersCount >= 10 || totalSpent >= 1000) return 'Gold Crave Member';
    if (ordersCount >= 5) return 'Silver Crave Member';
    return 'Bronze Crave Member';
  };

  const memberTier = getMemberTier();

  // Photo Select & Validation Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation 1: Format check
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      addToast('Invalid file format. Please upload a JPG, PNG, or WebP photo.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validation 2: Max Size 5MB
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size exceeds 5MB limit. Please choose a smaller photo.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Resize/Crop canvas max 400x400
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewPhoto(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Photo Save Handler
  const handleSavePhoto = async () => {
    if (!previewPhoto) return;
    setUploadingPhoto(true);
    try {
      await updateProfile({ avatar: previewPhoto, profilePhoto: previewPhoto });
      addToast('Profile photo updated successfully!', 'success');
      setPreviewPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      addToast('Failed to save profile photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Photo Remove Handler
  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    try {
      await updateProfile({ avatar: '', profilePhoto: '' });
      addToast('Profile photo removed. Restored initials avatar.', 'info');
      setPreviewPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      addToast('Failed to remove profile photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          {/* Avatar Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <UserAvatar user={user} size="xl" previewUrl={previewPhoto} />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-brand-orange hover:bg-brand-orange-hover text-white p-2 rounded-full shadow-soft-md hover:scale-110 transition-transform cursor-pointer border-2 border-white"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Photo Action Buttons */}
            {previewPhoto ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  disabled={uploadingPhoto}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-soft-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{uploadingPhoto ? 'Saving...' : 'Save Photo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPreviewPhoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (user?.avatar || user?.profilePhoto) ? (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Photo</span>
                </button>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-brand-orange border border-orange-200 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-2xl font-bold text-gray-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-700 bg-amber-100 rounded-full border border-amber-300">
                {memberTier}
              </span>
            </div>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-gray-600 font-medium">
              <span>🍕 {ordersCount} {ordersCount === 1 ? 'Order' : 'Orders'} Placed</span>
              <span>🏆 {cravePoints} Crave Points</span>
              <span>💰 ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Total Spent</span>
            </div>
          </div>
        </div>

        {/* Quick Nav Badges */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
          <Link
            to="/history"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-brand-orange text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-orange-200"
          >
            <Clock className="w-4 h-4" />
            <span>Order History</span>
          </Link>
          <Link
            to="/settings"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-sm space-y-6">
        <h3 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Account & Delivery Details
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Email (Primary Account)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 text-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Default Delivery Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              required
              className="w-full bg-gray-50 text-sm rounded-xl p-3.5 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
