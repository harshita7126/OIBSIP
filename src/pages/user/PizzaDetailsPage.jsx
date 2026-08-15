import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Flame, ArrowLeft, ShoppingBag, Plus, Minus } from 'lucide-react';
import { pizzaService } from '../../services/pizzaService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatImageUrl } from '../../utils/imageUtils';

export const PizzaDetailsPage = () => {
  const { id } = useParams();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState({ name: 'Medium (12")', multiplier: 1.0 });
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const data = await pizzaService.getPizzaById(id || 'pizza-1');
        setPizza(data);
        if (data.sizes) setSelectedSize(data.sizes[1]);
      } catch (err) {
        console.error('Failed to load pizza', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizza();
  }, [id]);

  if (loading || !pizza) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Crave details...
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: pizza.id,
      name: pizza.name,
      image: pizza.image,
      price: pizza.price,
      selectedSize,
      quantity,
      customizations: pizza.ingredients
    });
    addToast(`Added ${quantity}x ${pizza.name} to cart!`, 'success');
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/menu" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-orange">
        <ArrowLeft className="w-4 h-4" /> Back to Full Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm">
        <img
          src={formatImageUrl(pizza.image)}
          alt={pizza.name}
          className="w-full h-96 object-cover rounded-3xl shadow-soft-md"
        />

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">{pizza.category}</span>
            <h1 className="font-display text-3xl font-extrabold text-gray-900 mt-1">{pizza.name}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{pizza.description}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400" /> {pizza.rating} ({pizza.reviewsCount} reviews)
            </div>
            <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <Clock className="w-4 h-4 text-brand-orange" /> {pizza.prepTime}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-700 block mb-2">Crust Size</span>
            <div className="grid grid-cols-3 gap-2">
              {pizza.sizes?.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedSize.name === size.name
                      ? 'border-brand-orange bg-orange-50 text-brand-orange shadow-soft-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white font-bold">-</button>
              <span className="w-6 text-center font-bold text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-white font-bold">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{(pizza.price * selectedSize.multiplier * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
