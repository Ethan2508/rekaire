"use client";

// ============================================
// REKAIRE - Checkout Form Component
// Formulaire complet avec autocomplétion adresse
// ============================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import { trackCTAClick, trackCheckoutStart } from "@/lib/tracking";
import { generateOrderId } from "@/lib/order";
import { getMainProduct, formatPrice, calculateTotal } from "@/config/product";

interface AddressSuggestion {
  label: string;
  housenumber?: string;
  street?: string;
  postcode: string;
  city: string;
  context: string;
}

interface CheckoutFormProps {
  quantity: number;
  onBack: () => void;
}

export function CheckoutForm({ quantity, onBack }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    postalCode: "",
    city: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const product = getMainProduct();
  const { totalHT, totalTTC, unitPriceHT } = calculateTotal(quantity);

  // Recherche d'adresse avec l'API adresse.data.gouv.fr
  useEffect(() => {
    const searchAddress = async () => {
      if (addressQuery.length < 3) {
        setAddressSuggestions([]);
        return;
      }

      setIsSearchingAddress(true);
      try {
        // Recherche sans restriction de type pour plus de résultats
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            addressQuery
          )}&limit=6&autocomplete=1`
        );
        const data = await response.json();
        
        const suggestions: AddressSuggestion[] = data.features.map((f: any) => ({
          label: f.properties.label,
          housenumber: f.properties.housenumber || "",
          street: f.properties.street || f.properties.name,
          postcode: f.properties.postcode,
          city: f.properties.city,
          context: f.properties.context,
        }));
        
        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error("Address search error:", error);
      } finally {
        setIsSearchingAddress(false);
      }
    };

    const debounce = setTimeout(searchAddress, 300);
    return () => clearTimeout(debounce);
  }, [addressQuery]);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectAddress = (suggestion: AddressSuggestion) => {
    setFormData({
      ...formData,
      address: suggestion.street 
        ? `${suggestion.housenumber || ""} ${suggestion.street}`.trim()
        : suggestion.label.split(",")[0],
      postalCode: suggestion.postcode,
      city: suggestion.city,
    });
    setAddressQuery(suggestion.label);
    setShowSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Téléphone requis";
    } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro invalide";
    }
    if (isCompany && !formData.companyName.trim()) {
      newErrors.companyName = "Nom de l'entreprise requis";
    }
    if (!formData.address.trim()) newErrors.address = "Adresse requise";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Code postal requis";
    if (!formData.city.trim()) newErrors.city = "Ville requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    trackCTAClick("checkout-form");

    const orderId = generateOrderId();
    trackCheckoutStart(
      orderId,
      product.id,
      product.name,
      unitPriceHT,
      product.currency
    );

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId: product.id,
          quantity,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            isCompany,
            companyName: isCompany ? formData.companyName : null,
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  const inputClasses = (error?: string) =>
    `w-full px-4 py-3 rounded-xl border ${
      error 
        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20" 
        : "border-gray-200 bg-white focus:border-orange-500 focus:ring-orange-500/20"
    } focus:outline-none focus:ring-4 transition-all text-gray-900 placeholder-gray-400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Résumé commande */}
      <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">
            {quantity} × RK01
          </span>
          <span className="font-semibold text-gray-900">
            {formatPrice(totalHT, "EUR")} HT
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total TTC</span>
          <span>{formatPrice(totalTTC, "EUR")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type de client */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsCompany(false)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
              !isCompany
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Particulier
          </button>
          <button
            type="button"
            onClick={() => setIsCompany(true)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
              isCompany
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Entreprise
          </button>
        </div>

        {/* Nom entreprise (si entreprise) */}
        <AnimatePresence>
          {isCompany && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l&apos;entreprise *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Nom de votre entreprise"
                  className={`${inputClasses(errors.companyName)} pl-10`}
                />
              </div>
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jean"
              className={inputClasses(errors.firstName)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Dupont"
              className={inputClasses(errors.lastName)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean.dupont@email.com"
              className={`${inputClasses(errors.email)} pl-10`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              className={`${inputClasses(errors.phone)} pl-10`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Adresse avec autocomplétion */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse de livraison *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={addressInputRef}
              type="text"
              value={addressQuery}
              onChange={(e) => {
                setAddressQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Commencez à taper votre adresse..."
              className={`${inputClasses(errors.address)} pl-10 pr-10`}
            />
            {isSearchingAddress && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
          
          {/* Suggestions d'adresse */}
          <AnimatePresence>
            {showSuggestions && addressSuggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
              >
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectAddress(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-gray-900 text-sm font-medium">
                      {suggestion.label}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {suggestion.context}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* Code postal + Ville */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code postal *
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="75001"
              maxLength={5}
              className={inputClasses(errors.postalCode)}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Paris"
              className={inputClasses(errors.city)}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <span>Payer {formatPrice(totalTTC, "EUR")}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Sécurité */}
        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Paiement sécurisé par Stripe • Vos données sont protégées
        </p>
      </form>
    </motion.div>
  );
}
