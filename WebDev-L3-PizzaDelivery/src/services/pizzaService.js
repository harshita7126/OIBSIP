import api from "../api/api";
import { formatImageUrl } from "../utils/imageUtils";
import { builderService } from "./builderService";

export const pizzaService = {
  // Get all pizzas/products from MongoDB
  async getPizzas(filters = {}) {
    const response = await api.get("/products");

    let results = (response.data.products || []).map((p) => ({
      ...p,
      id: p._id,
      image: formatImageUrl(p.image),
      dietary: p.isVeg ? ["Veg"] : ["Non Veg"],
    }));

    if (filters.search) {
      const q = filters.search.toLowerCase();

      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.ingredients || []).some((ing) =>
            ing.toLowerCase().includes(q)
          )
      );
    }

    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.maxPrice) {
      results = results.filter(
        (p) => p.price <= filters.maxPrice
      );
    }

    if (filters.sortBy === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }
    results = results.map((pizza) => ({
      ...pizza,
      sizes: (pizza.sizes || []).map((size) => ({
        name: size,
        multiplier:
          size === "Small"
            ? 0.8
            : size === "Large"
              ? 1.3
              : 1,
      })),
    }));
    return results;
  },

  // Get one pizza by ID
  async getPizzaById(id) {
    const response = await api.get(`/products/${id}`);

    const product = response.data.product || {};

    return {
      ...product,
      id: product._id,
      image: formatImageUrl(product.image),
      dietary: product.isVeg
        ? ["Veg"]
        : ["Non Veg"],
    };
  },

  // Delegate Builder options to MongoDB builderService
  async getBuilderOptions() {
    return await builderService.getBuilderOptions();
  },
};

export default pizzaService;