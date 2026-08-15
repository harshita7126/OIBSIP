import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Star, Check, Pencil, Eye, EyeOff } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { formatImageUrl } from '../../utils/imageUtils';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    name: '',
    category: 'Signature',
    price: '',
    description: '',
    image: '',
    ingredientsInput: 'Mozzarella, Tomato Sauce, Basil',
    sizes: ['Small', 'Medium', 'Large'],
    isVeg: true,
    stock: 50,
    isAvailable: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingProductId(null);
  };

  const handleToggleAvailability = async (pizza) => {
    const nextState = pizza.isAvailable === false ? true : false;
    try {
      await adminService.toggleProductAvailability(pizza.id, nextState);
      addToast(`${pizza.name} is now ${nextState ? 'Available' : 'Unavailable'} on Menu`, 'success');
      fetchProducts();
    } catch (err) {
      addToast('Failed to update availability', 'error');
    }
  };

  const openEditModal = (pizza) => {
    setEditingProductId(pizza.id);
    setFormData({
      name: pizza.name || '',
      category: pizza.category || 'Signature',
      price: pizza.price || '',
      description: pizza.description || '',
      image: pizza.image || '',
      ingredientsInput: Array.isArray(pizza.ingredients) ? pizza.ingredients.join(', ') : 'Mozzarella, Tomato Sauce',
      sizes: (pizza.sizes || []).map(s => typeof s === 'object' ? s.name : s),
      isVeg: pizza.isVeg !== undefined ? pizza.isVeg : true,
      stock: pizza.stock || 50,
      isAvailable: pizza.isAvailable !== false,
    });
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProductId) return;

    const ingredientsArray = formData.ingredientsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const productPayload = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      image: formData.image.trim(),
      ingredients: ingredientsArray,
      isVeg: Boolean(formData.isVeg),
      stock: parseInt(formData.stock, 10) || 0,
      isAvailable: Boolean(formData.isAvailable),
    };

    try {
      setSubmitting(true);
      await adminService.updateProduct(editingProductId, productPayload);
      addToast(`Updated ${formData.name}!`, 'success');
      setIsEditModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast('Failed to update product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteProduct(id);
      addToast('Product availability updated/removed', 'success');
      fetchProducts();
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const toggleSize = (sizeName) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(sizeName);
      const updatedSizes = exists
        ? prev.sizes.filter((s) => s !== sizeName)
        : [...prev.sizes, sizeName];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (formData.sizes.length === 0) {
      addToast('Please select at least one size for the product', 'error');
      return;
    }

    const ingredientsArray = formData.ingredientsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const productPayload = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      image: formData.image.trim(),
      ingredients: ingredientsArray,
      sizes: formData.sizes,
      isVeg: Boolean(formData.isVeg),
      stock: parseInt(formData.stock, 10) || 0,
      isAvailable: Boolean(formData.isAvailable),
    };

    try {
      setSubmitting(true);
      await adminService.addProduct(productPayload);
      addToast(`Added ${formData.name} to menu!`, 'success');
      setIsAddModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.customMessage || 'Failed to add product';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Product Catalog & Menu</h2>
          <p className="text-xs text-slate-400">Manage store pizzas, pricing, and signature menu items</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Pizza Crave
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((pizza) => (
          <div key={pizza.id} className={`bg-slate-900 border ${pizza.isAvailable === false ? 'border-amber-900/40 opacity-75' : 'border-slate-800'} rounded-2xl p-5 space-y-4 relative`}>
            <div className="relative">
              <img
                src={formatImageUrl(pizza.image)}
                alt={pizza.name}
                className="w-full h-40 rounded-xl object-cover border border-slate-800"
              />
              <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                pizza.isAvailable !== false
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
              }`}>
                {pizza.isAvailable !== false ? 'Available' : 'Unavailable (Hidden)'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{pizza.category}</span>
                <span className="font-display text-base font-bold text-white">₹{pizza.price}</span>
              </div>
              <h3 className="font-display font-bold text-white text-base mt-0.5">{pizza.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pizza.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleAvailability(pizza)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  pizza.isAvailable !== false
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30'
                }`}

              >
                {pizza.isAvailable !== false ? (
                  <><EyeOff className="w-3.5 h-3.5" /> Make Unavailable</>
                ) : (
                  <><Eye className="w-3.5 h-3.5" /> Make Available</>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(pizza)}
                  className="p-2 text-slate-400 hover:text-purple-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Product"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pizza.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Delete/Deactivate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add product */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Create New Product Item"
        dark={true}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Product Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Sourdough Diavola"
              className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-500"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-slate-950 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value="Signature">Signature</option>
                <option value="Veggie">Veggie</option>
                <option value="Meat Lovers">Meat Lovers</option>
                <option value="Crust Specials">Crust Specials</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Price ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="18.99"
                className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={2}
              placeholder="Handcrafted pizza topped with fresh mozzarella, basil..."
              className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Image URL <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-500"
            />
            {formData.image && (
              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                <img
                  src={formatImageUrl(formData.image)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Ingredients <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.ingredientsInput}
              onChange={(e) => setFormData({ ...formData, ingredientsInput: e.target.value })}
              placeholder="Mozzarella, Tomato Sauce, Fresh Basil"
              className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-500"
            />
            {formData.ingredientsInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.ingredientsInput
                  .split(',')
                  .map((ing) => ing.trim())
                  .filter(Boolean)
                  .map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 text-[11px] font-medium bg-purple-950/60 text-purple-300 border border-purple-800/50 rounded-lg"
                    >
                      {ing}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Sizes Checkboxes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Available Sizes</label>
            <div className="grid grid-cols-3 gap-2">
              {['Small', 'Medium', 'Large'].map((size) => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Veg / Non-Veg & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Dietary Type</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVeg: true })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formData.isVeg
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Veg
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVeg: false })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !formData.isVeg
                      ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Non-Veg
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-500"
              />
            </div>
          </div>

          {/* Available Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Availability Status</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                formData.isAvailable
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    formData.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                Available in Store Menu
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                {formData.isAvailable ? 'Active' : 'Disabled'}
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal to edit product */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Product Details"
        dark={true}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleEditProduct} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-slate-950 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none"
              >
                <option value="Signature">Signature</option>
                <option value="Classic">Classic</option>
                <option value="Artisan">Artisan</option>
                <option value="Gourmet">Gourmet</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full bg-slate-950/80 text-white text-sm rounded-xl p-3 border border-slate-700/60 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Availability Status</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                formData.isAvailable
                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${formData.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {formData.isAvailable ? 'Available on Customer Menu' : 'Hidden from Customer Menu'}
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                {formData.isAvailable ? 'Active' : 'Unavailable'}
              </span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-950/50 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Product Changes'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

