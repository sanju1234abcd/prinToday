import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  ZapOff
} from 'lucide-react';
import { Product, QuantityMode, DiscountTier, DiscountType } from '../../types';
import { calculateProductPrice, formatINR } from '../../utils/pricingEngine';
import { ProductConfigurator } from '../product/ProductConfigurator';

// ─── Local Storage Key ────────────────────────────────────────────────────
const LS_KEY = 'printoday_admin_simulator_v1';

interface SimState {
  title: string;
  basePrice: number;
  requiresDimensions: boolean;
  quantityMode: QuantityMode;
  minQuantity: number;
  quantityStep: number;
  presetOptionsStr: string; // comma-separated
  discountTiers: DiscountTier[];
}

const DEFAULT_STATE: SimState = {
  title: 'Test Product',
  basePrice: 299,
  requiresDimensions: false,
  quantityMode: 'CUSTOM_INTERVAL',
  minQuantity: 1,
  quantityStep: 1,
  presetOptionsStr: '1, 5, 10, 25, 50',
  discountTiers: [
    { minQty: 10, maxQty: 24, discountType: 'PERCENTAGE', discountValue: 5 },
    { minQty: 25, maxQty: null, discountType: 'PERCENTAGE', discountValue: 10 }
  ]
};

function loadState(): SimState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(s: SimState) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// Build a synthetic Product for the configurator
function buildProduct(s: SimState): Product {
  const presetOptions = s.presetOptionsStr
    .split(',')
    .map(v => parseInt(v.trim(), 10))
    .filter(v => !isNaN(v) && v > 0);

  return {
    id: 'simulator-product',
    categoryId: 'cat-business',
    subcategoryId: 'sub-business-0',
    title: s.title || 'Untitled Product',
    slug: 'simulator-product',
    description: 'Live admin pricing simulation — not a real product.',
    basePrice: s.basePrice,
    pricingType: s.requiresDimensions ? 'per_sqft' : 'fixed',
    minQuantity: s.minQuantity,
    quantityPresets: presetOptions,
    quantityConfig: {
      quantityMode: s.quantityMode,
      minQuantity: s.minQuantity,
      quantityStep: s.quantityStep,
      presetOptions: presetOptions.length > 0 ? presetOptions : undefined
    },
    discountTiers: s.discountTiers,
    requirements: {
      requiresArtworkUpload: false,
      requiresCustomDimensions: s.requiresDimensions,
      dimensionUnit: 'ft',
      defaultWidth: 6,
      defaultHeight: 3,
      minSqFt: 0,
      variantOptions: []
    },
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    badges: ['Simulator'],
    rating: 5,
    reviewsCount: 0,
    turnaroundTime: 'N/A'
  };
}

// ─── Quick-Check Matrix Breakpoints ──────────────────────────────────────
const BREAKPOINTS = [1, 5, 10, 25, 50, 100, 200, 500, 1000];

// ─── Component ────────────────────────────────────────────────────────────
export const PricingSimulator: React.FC = () => {
  const [state, setState] = useState<SimState>(loadState);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const updateState = (patch: Partial<SimState>) => {
    const next = { ...state, ...patch };
    setState(next);
    saveState(next);
  };

  const simulatedProduct = useMemo(() => buildProduct(state), [state]);

  // ── Tier Helpers ──────────────────────────────────────────────
  const addTier = () => {
    const tiers = [...state.discountTiers];
    const lastMax = tiers[tiers.length - 1]?.maxQty ?? 0;
    tiers.push({ minQty: (lastMax || 0) + 1, maxQty: null, discountType: 'PERCENTAGE', discountValue: 5 });
    updateState({ discountTiers: tiers });
  };

  const removeTier = (i: number) => {
    const tiers = state.discountTiers.filter((_, idx) => idx !== i);
    updateState({ discountTiers: tiers });
  };

  const updateTier = (i: number, patch: Partial<DiscountTier>) => {
    const tiers = state.discountTiers.map((t, idx) => idx === i ? { ...t, ...patch } : t);
    updateState({ discountTiers: tiers });
  };

  // ── Quick-Check Matrix ────────────────────────────────────────
  const matrixRows = useMemo(() => {
    return BREAKPOINTS.map(qty => {
      const breakdown = calculateProductPrice({
        basePrice: state.basePrice,
        quantity: qty,
        pricingType: state.requiresDimensions ? 'per_sqft' : 'fixed',
        widthFt: 6,
        heightFt: 3,
        requiresCustomDimensions: state.requiresDimensions,
        minSqFt: 0,
        discountTiers: state.discountTiers
      });
      return { qty, breakdown };
    });
  }, [state.basePrice, state.requiresDimensions, state.discountTiers]);

  // ── Form Panel ────────────────────────────────────────────────
  const FormPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-brand-blue" />
        <h3 className="font-extrabold text-slate-900 text-base">Pricing Rule Simulator</h3>
      </div>

      {/* Basic Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label-sm">Product Title</label>
          <input
            value={state.title}
            onChange={e => updateState({ title: e.target.value })}
            className="input-field"
            placeholder="e.g., Premium Matte Cards"
          />
        </div>
        <div>
          <label className="label-sm">Base Price (₹)</label>
          <input
            type="number"
            value={state.basePrice}
            onChange={e => updateState({ basePrice: Number(e.target.value) })}
            className="input-field"
          />
        </div>
        <div className="flex flex-col justify-end">
          <label className="label-sm">Sq.Ft Pricing?</label>
          <button
            onClick={() => updateState({ requiresDimensions: !state.requiresDimensions })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
              state.requiresDimensions
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            {state.requiresDimensions ? '✓ Per Sq.Ft' : 'Fixed Price'}
          </button>
        </div>
      </div>

      {/* Quantity Mode */}
      <div>
        <label className="label-sm">Quantity Mode</label>
        <div className="flex gap-1 flex-wrap">
          {(['PRESET_ONLY', 'CUSTOM_INTERVAL', 'ANY_QUANTITY'] as QuantityMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => updateState({ quantityMode: mode })}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                state.quantityMode === mode
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {mode.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-sm">
            Min {state.requiresDimensions ? 'Sq Ft' : 'Quantity'}
          </label>
          <input
            type="number"
            value={state.minQuantity}
            onChange={e => updateState({ minQuantity: Math.max(1, Number(e.target.value)) })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-sm">Step / Interval</label>
          <input
            type="number"
            value={state.quantityStep}
            onChange={e => updateState({ quantityStep: Math.max(1, Number(e.target.value)) })}
            className="input-field"
          />
        </div>
        {(state.quantityMode === 'PRESET_ONLY' || state.quantityMode === 'CUSTOM_INTERVAL') && (
          <div className="col-span-2">
            <label className="label-sm">Preset Options (comma-separated)</label>
            <input
              value={state.presetOptionsStr}
              onChange={e => updateState({ presetOptionsStr: e.target.value })}
              className="input-field"
              placeholder="100, 250, 500, 1000"
            />
          </div>
        )}
      </div>

      {/* Discount Tiers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label-sm mb-0">Discount Tiers</label>
          <button
            onClick={addTier}
            className="flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-brand-navy bg-brand-blue-soft px-2.5 py-1 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tier
          </button>
        </div>

        {state.discountTiers.length === 0 && (
          <div className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-xl">
            <ZapOff className="w-5 h-5 mx-auto mb-1 opacity-40" />
            No discount tiers — all orders at base price.
          </div>
        )}

        <div className="space-y-2">
          {state.discountTiers.map((tier, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Tier {i + 1}</span>
                <button onClick={() => removeTier(i)} className="p-1 text-slate-400 hover:text-rose-500 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label-sm">Min Qty</label>
                  <input
                    type="number"
                    value={tier.minQty}
                    onChange={e => updateTier(i, { minQty: Number(e.target.value) })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-sm">Max Qty (blank = ∞)</label>
                  <input
                    type="number"
                    value={tier.maxQty ?? ''}
                    onChange={e => updateTier(i, { maxQty: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="∞"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-sm">Type</label>
                  <select
                    value={tier.discountType}
                    onChange={e => updateTier(i, { discountType: e.target.value as DiscountType })}
                    className="input-field text-xs"
                  >
                    <option value="PERCENTAGE">% Percentage</option>
                    <option value="FLAT_AMOUNT">₹ Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="label-sm">Value</label>
                  <input
                    type="number"
                    value={tier.discountValue}
                    onChange={e => updateTier(i, { discountValue: Number(e.target.value) })}
                    className="input-field text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-Check Matrix */}
      <div>
        <label className="label-sm">Quick-Check Price Matrix</label>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-3 py-2 text-left">
                  {state.requiresDimensions ? 'Copies (×18 sq ft each)' : 'Qty'}
                </th>
                <th className="px-3 py-2 text-right">Raw Price</th>
                <th className="px-3 py-2 text-right">Discount</th>
                <th className="px-3 py-2 text-right">Final Price</th>
                <th className="px-3 py-2 text-right">Rate/Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixRows.map(({ qty, breakdown }) => {
                const hasDiscount = breakdown.appliedTier !== null;
                return (
                  <tr key={qty} className={hasDiscount ? 'bg-brand-green/5' : ''}>
                    <td className="px-3 py-2 font-bold text-slate-900">
                      {qty}
                      {hasDiscount && (
                        <span className="ml-1.5 text-[9px] font-extrabold text-brand-green bg-brand-green/15 px-1.5 py-0.5 rounded">
                          {breakdown.appliedDiscountPercent}% OFF
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-400">{formatINR(breakdown.rawTotalPrice)}</td>
                    <td className={`px-3 py-2 text-right font-bold ${hasDiscount ? 'text-brand-green' : 'text-slate-300'}`}>
                      -{formatINR(breakdown.discountAmount)}
                    </td>
                    <td className="px-3 py-2 text-right font-extrabold text-brand-blue">{formatINR(breakdown.finalTotalPrice)}</td>
                    <td className="px-3 py-2 text-right text-slate-500">{formatINR(breakdown.effectiveUnitPrice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── Configurator Preview ──────────────────────────────────────
  const ConfiguratorPreview = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-brand-blue" />
        <h4 className="font-extrabold text-slate-900 text-sm">Live Configurator Preview</h4>
      </div>
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
        <ProductConfigurator product={simulatedProduct} hideActions />
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: side-by-side layout ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
          <FormPanel />
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
          <ConfiguratorPreview />
        </div>
      </div>

      {/* ── Mobile: floating button + bottom sheet ── */}
      <div className="lg:hidden">
        {/* Form always visible on mobile */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <FormPanel />
        </div>

        {/* Floating Test Button */}
        <button
          onClick={() => setBottomSheetOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-navy text-white font-extrabold text-sm rounded-2xl shadow-2xl shadow-brand-blue/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Calculator className="w-4 h-4" />
          🧮 Test Pricing Engine
        </button>

        {/* Bottom Sheet Modal */}
        {bottomSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBottomSheetOpen(false)} />
            <div className="relative bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-brand-blue" />
                  Live Configurator Preview
                </h3>
                <button
                  onClick={() => setBottomSheetOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ConfiguratorPreview />
            </div>
          </div>
        )}
      </div>

      {/* Utility styles injected inline (Tailwind JIT may need explicit class references) */}
      <style>{`
        .label-sm { @apply text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1; }
        .input-field { @apply w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-brand-blue focus:outline-none transition; }
      `}</style>
    </>
  );
};
