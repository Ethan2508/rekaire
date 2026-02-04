"use client";

// ============================================
// REKAIRE - Page Checkout
// Parcours optimisé avec étapes + CGV conditionnelles
// ============================================

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  Shield,
  Truck,
  Package,
  MessageSquare,
  ShoppingCart,
  Minus,
  Plus,
  FileText,
} from "lucide-react";
import { Header, Footer } from "@/components";
import { CheckoutProgress } from "@/components/checkout-progress";
import { trackCTAClick, trackCheckoutStart } from "@/lib/tracking";
import { generateOrderId } from "@/lib/order";
import { validatePromoCode, incrementPromoUsage, formatDiscount } from "@/lib/promo";
import { getMainProduct, formatPrice, calculateTotal } from "@/config/product";
import Link from "next/link";
import Image from "next/image";

interface AddressSuggestion {
  label: string;
  housenumber?: string;
  street?: string;
  postcode: string;
  city: string;
  context: string;
}

// Seuil pour demande de devis (10+ = devis obligatoire)
const QUOTE_THRESHOLD = 10;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQty = parseInt(searchParams.get("qty") || "1", 10);

  const [quantity, setQuantity] = useState(Math.max(1, Math.min(10, initialQty)));
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  // États code promo
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null);

  // Adresse autocomplétion
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
    message: "", // Pour devis
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const product = getMainProduct();
  const isQuoteMode = quantity >= QUOTE_THRESHOLD;
  const { totalHT, totalTTC, unitPriceHT } = calculateTotal(quantity);

  // Calculs avec code promo (tout est déjà en centimes)
  const totalHTAfterPromo = Math.max(0, totalHT - promoDiscount);
  const totalTTCAfterPromo = Math.round(totalHTAfterPromo * 1.2);

  // Fonction de validation du code promo
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidatingPromo(true);
    setPromoError("");

    const validation = await validatePromoCode(promoCode.toUpperCase(), totalHT);

    if (validation.valid && validation.discount && validation.code) {
      setPromoDiscount(validation.discount);
      setAppliedPromoCode(validation.code);
      setPromoError("");
    } else {
      setPromoDiscount(0);
      setAppliedPromoCode(null);
      setPromoError(validation.error || "Code invalide");
    }

    setIsValidatingPromo(false);
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoDiscount(0);
    setAppliedPromoCode(null);
    setPromoError("");
  };

  // Recherche d'adresse
  useEffect(() => {
    const searchAddress = async () => {
      if (addressQuery.length < 3) {
        setAddressSuggestions([]);
        return;
      }

      setIsSearchingAddress(true);
      try {
        // Recherche optimisée : plus de résultats + détection ville
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            addressQuery
          )}&limit=10&autocomplete=1`
        );
        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          // Fallback: recherche sans autocomplete si aucun résultat
          const fallbackResponse = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
              addressQuery
            )}&limit=10`
          );
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.features) {
            const suggestions: AddressSuggestion[] = fallbackData.features.map((f: any) => ({
              label: f.properties.label,
              housenumber: f.properties.housenumber || "",
              street: f.properties.street || f.properties.name,
              postcode: f.properties.postcode,
              city: f.properties.city,
              context: f.properties.context,
            }));
            
            setAddressSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0);
          }
        } else {
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
        }
      } catch (error) {
        console.error("Address search error:", error);
      } finally {
        setIsSearchingAddress(false);
      }
    };

    const debounce = setTimeout(searchAddress, 300);
    return () => clearTimeout(debounce);
  }, [addressQuery]);

  // Fermer suggestions
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

  // Sauvegarder le lead dès que l'email est valide
  useEffect(() => {
    const saveLeadAsync = async () => {
      if (
        !leadSaved &&
        formData.email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        try {
          await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              firstName: formData.firstName || null,
              lastName: formData.lastName || null,
              phone: formData.phone || null,
              isCompany,
              companyName: formData.companyName || null,
              source: isQuoteMode ? "checkout-devis" : "checkout",
            }),
          });
          setLeadSaved(true);
        } catch (e) {
          console.error("Lead save error:", e);
        }
      }
    };

    const debounce = setTimeout(saveLeadAsync, 1000);
    return () => clearTimeout(debounce);
  }, [formData.email, formData.firstName, formData.lastName, formData.phone, isCompany, formData.companyName, leadSaved, isQuoteMode]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep1 = () => {
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
    } else if (
      !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(
        formData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Numéro invalide";
    }
    if (isCompany && !formData.companyName.trim()) {
      newErrors.companyName = "Nom de l'entreprise requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address.trim()) newErrors.address = "Adresse requise";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Code postal requis";
    if (!formData.city.trim()) newErrors.city = "Ville requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cgvAccepted) {
      setErrors({ cgv: "Vous devez accepter les CGV" });
      return;
    }

    setIsLoading(true);
    trackCTAClick("checkout-page");

    if (isQuoteMode) {
      // Mode devis : envoyer formulaire contact
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            company: isCompany ? formData.companyName : "",
            subject: "devis",
            message: `Demande de devis pour ${quantity} unités RK01.\n\nAdresse de livraison :\n${formData.address}\n${formData.postalCode} ${formData.city}\n\nMessage : ${formData.message || "Aucun message supplémentaire"}`,
          }),
        });

        if (response.ok) {
          router.push("/contact?success=devis");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Quote request error:", error);
        setIsLoading(false);
      }
    } else {
      // Mode paiement Stripe
      const orderId = generateOrderId();
      trackCheckoutStart(orderId, product.id, product.name, unitPriceHT, product.currency);

      // Incrémenter l'usage du code promo si appliqué
      if (appliedPromoCode) {
        await incrementPromoUsage(appliedPromoCode.id);
      }

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            productId: product.id,
            quantity,
            promoCode: appliedPromoCode?.code || null,
            promoDiscount: promoDiscount || 0,
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
    }
  };

  const inputClasses = (error?: string) =>
    `w-full px-4 py-3 rounded-xl border ${
      error
        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 bg-white focus:border-orange-500 focus:ring-orange-500/20"
    } focus:outline-none focus:ring-4 transition-all text-gray-900 placeholder-gray-400`;

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  // Étapes
  const steps = [
    { id: 1, name: "Informations", icon: User },
    { id: 2, name: "Livraison", icon: Truck },
    { id: 3, name: isQuoteMode ? "Devis" : "Paiement", icon: isQuoteMode ? FileText : ShoppingCart },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-orange-500">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/produit" className="hover:text-orange-500">
              RK01
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Commande</span>
          </nav>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      step >= s.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium text-sm">{s.name}</span>
                    <span className="sm:hidden font-medium text-sm">{s.id}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-1 mx-2 rounded ${
                        step > s.id ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* ÉTAPE 1 : Informations */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Vos informations
                        </h2>

                        {/* Type client */}
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

                        {/* Entreprise */}
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
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.companyName}
                                </p>
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
                              <p className="text-red-500 text-xs mt-1">
                                {errors.firstName}
                              </p>
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
                              <p className="text-red-500 text-xs mt-1">
                                {errors.lastName}
                              </p>
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
                            <p className="text-red-500 text-xs mt-1">
                              {errors.email}
                            </p>
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
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          Continuer
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}

                    {/* ÉTAPE 2 : Livraison */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Adresse de livraison
                        </h2>

                        {/* Adresse avec autocomplétion */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse *
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
                              onFocus={() =>
                                addressSuggestions.length > 0 && setShowSuggestions(true)
                              }
                              placeholder="Commencez à taper votre adresse..."
                              className={`${inputClasses(errors.address)} pl-10 pr-10`}
                            />
                            {isSearchingAddress && (
                              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                            )}
                          </div>

                          {/* Suggestions */}
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
                              <p className="text-red-500 text-xs mt-1">
                                {errors.postalCode}
                              </p>
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

                        {/* Message pour devis */}
                        {isQuoteMode && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Message (optionnel)
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={3}
                              placeholder="Précisions sur votre demande de devis..."
                              className={inputClasses()}
                            />
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                          </button>
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                          >
                            Continuer
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ÉTAPE 3 : Récapitulatif + Paiement/Devis */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          {isQuoteMode ? "Confirmer la demande de devis" : "Finaliser la commande"}
                        </h2>

                        {/* Récapitulatif infos */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Contact</span>
                            <span className="text-gray-900 font-medium">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Email</span>
                            <span className="text-gray-900">{formData.email}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Téléphone</span>
                            <span className="text-gray-900">{formData.phone}</span>
                          </div>
                          {isCompany && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Entreprise</span>
                              <span className="text-gray-900">{formData.companyName}</span>
                            </div>
                          )}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Livraison</span>
                              <span className="text-gray-900 text-right">
                                {formData.address}
                                <br />
                                {formData.postalCode} {formData.city}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CGV - Conditionnelles */}
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="cgv"
                            checked={cgvAccepted}
                            onChange={(e) => {
                              setCgvAccepted(e.target.checked);
                              if (errors.cgv) setErrors({ ...errors, cgv: "" });
                            }}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="cgv" className="text-sm text-gray-600">
                            J&apos;accepte les{" "}
                            <Link
                              href={isCompany ? "/cgv-pro" : "/cgv"}
                              target="_blank"
                              className="text-orange-500 hover:text-orange-600 underline"
                            >
                              Conditions Générales de Vente{isCompany ? " Professionnels" : ""}
                            </Link>{" "}
                            *
                          </label>
                        </div>
                        {errors.cgv && (
                          <p className="text-red-500 text-xs">{errors.cgv}</p>
                        )}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                          </button>

                          {isQuoteMode ? (
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Envoi...
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="w-5 h-5" />
                                  Demander un devis
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Traitement...
                                </>
                              ) : (
                                <>
                                  <span>Payer {formatPrice(totalTTCAfterPromo, "EUR")}</span>
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {!isQuoteMode && (
                          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            Paiement sécurisé par Stripe
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>

            {/* Sidebar - Récapitulatif commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-28">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Votre commande
                </h3>

                {/* Produit */}
                <div className="flex gap-4 pb-4 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.shortName}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.shortName}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      Extincteur automatique pour tableaux électriques
                    </p>
                  </div>
                </div>

                {/* Sélecteur quantité */}
                <div className="py-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={decreaseQty}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center font-semibold text-lg border-x border-gray-300 bg-white text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQty}
                        disabled={quantity >= 10}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {quantity >= 2 && quantity < QUOTE_THRESHOLD && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        -14%
                      </span>
                    )}
                  </div>
                </div>

                {/* Prix ou mode devis */}
                <div className="py-4 space-y-2">
                  {isQuoteMode ? (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Demande de devis</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Pour {quantity} unités ou plus, nous vous proposons un tarif personnalisé.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {quantity} × RK01 ({formatPrice(unitPriceHT, "EUR")}/u)
                        </span>
                        <span className="text-gray-900">{formatPrice(totalHT, "EUR")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">TVA (20%)</span>
                        <span className="text-gray-900">
                          {formatPrice(totalTTC - totalHT, "EUR")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Livraison</span>
                        <span className="text-green-600 font-medium">Offerte</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Code promo ({appliedPromoCode?.code})
                          </span>
                          <span className="text-green-600 font-medium">
                            -{formatPrice(promoDiscount, "EUR")}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total TTC</span>
                        <div className="text-right">
                          {promoDiscount > 0 && (
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(totalTTC, "EUR")}
                            </div>
                          )}
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(totalTTCAfterPromo, "EUR")}
                          </span>
                        </div>
                      </div>

                      {/* Champ code promo */}
                      <div className="pt-4 border-t border-gray-200">
                        {!appliedPromoCode ? (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Code promo
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                  setPromoCode(e.target.value.toUpperCase());
                                  setPromoError("");
                                }}
                                placeholder="REKAIRE12"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm uppercase"
                              />
                              <button
                                type="button"
                                onClick={handleApplyPromo}
                                disabled={!promoCode.trim() || isValidatingPromo}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isValidatingPromo ? "..." : "Appliquer"}
                              </button>
                            </div>
                            {promoError && (
                              <p className="text-xs text-red-600">{promoError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <Check className="w-4 h-4" />
                              <span className="font-medium">{appliedPromoCode.code} appliqué</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="text-xs text-green-600 hover:text-green-700 underline"
                            >
                              Retirer
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Garanties */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-orange-500" />
                    <span>Livraison gratuite en France</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <span>Garantie 5 ans</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Package className="w-5 h-5 text-orange-500" />
                    <span>Retour sous 14 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
