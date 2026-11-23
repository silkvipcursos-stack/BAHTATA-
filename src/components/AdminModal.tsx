import { useEffect, useState, type FormEvent } from 'react';
import { Plus, RotateCcw, Save, Settings, Trash2, X } from 'lucide-react';
import { DEFAULT_STORE_CONFIG } from '../data/menu';
import type { StoreConfig, ToppingCategory, ToppingItem } from '../types';
import { onlyDigits } from '../utils/pricing';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeConfig: StoreConfig;
  onSave: (config: StoreConfig) => void;
}

export function AdminModal({
  isOpen,
  onClose,
  storeConfig,
  onSave,
}: AdminModalProps) {
  const [draft, setDraft] = useState<StoreConfig>(storeConfig);
  const [newName, setNewName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<ToppingCategory>(
    'Crocantes & Vegetais'
  );
  const [newPrice, setNewPrice] = useState('4.00');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(storeConfig);
      setSavedNotice(false);
    }
  }, [isOpen, storeConfig]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parseDecimal = (raw: string, fallback = 0): number => {
    const normalized = raw.replace(',', '.');
    const num = Number(normalized);
    if (!Number.isFinite(num) || num < 0) return fallback;
    return Math.round(num * 100) / 100;
  };

  const updateFlavorPrice = (
    key: keyof StoreConfig['flavorPrices'],
    raw: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      flavorPrices: {
        ...prev.flavorPrices,
        [key]: parseDecimal(raw, prev.flavorPrices[key]),
      },
    }));
  };

  const updateCreamyPrice = (
    key: keyof StoreConfig['creamyPrices'],
    raw: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      creamyPrices: {
        ...prev.creamyPrices,
        [key]: parseDecimal(raw, prev.creamyPrices[key]),
      },
    }));
  };

  const updateToppingField = (
    id: string,
    field: 'name' | 'detail' | 'price',
    raw: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      toppings: prev.toppings.map((item) => {
        if (item.id !== id) return item;
        if (field === 'price') {
          return { ...item, price: parseDecimal(raw, item.price) };
        }
        return { ...item, [field]: raw };
      }),
    }));
  };

  const removeTopping = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      toppings: prev.toppings.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanedWhatsapp =
      onlyDigits(draft.whatsappNumber) || DEFAULT_STORE_CONFIG.whatsappNumber;
    onSave({ ...draft, whatsappNumber: cleanedWhatsapp });
    setSavedNotice(true);
    window.setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 650);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-config-heading"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] bg-[#FAF9F6] rounded-2xl border border-[#E5E2DC] shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-[#E5E2DC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-[#F3F1EC] flex items-center justify-center text-[#171614]">
              <Settings className="w-4 h-4" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="admin-config-heading"
                className="font-display text-lg font-bold text-[#171614]"
              >
                Configurações da Loja & Preços
              </h2>
              <p className="text-xs text-[#57534E]">
                Ajuste sabores, adicionais, taxa de entrega e WhatsApp oficial.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar configurações"
            className="w-9 h-9 rounded-lg border border-[#E5E2DC] flex items-center justify-center text-[#57534E] hover:text-[#171614] hover:bg-[#F3F1EC] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form
          id="admin-config-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-4">
            <h3 className="font-display text-sm font-bold text-[#171614]">
              WhatsApp & Entrega
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label
                  htmlFor="cfg-whatsapp"
                  className="block text-[11px] font-medium text-[#57534E] mb-1"
                >
                  WhatsApp (55 + DDD + Nº)
                </label>
                <input
                  id="cfg-whatsapp"
                  type="text"
                  value={draft.whatsappNumber}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      whatsappNumber: e.target.value.replace(/\D/g, ''),
                    }))
                  }
                  placeholder="5511999999999"
                  className="w-full rounded-lg border border-[#D6D2C9] bg-[#FAF9F6] px-3 py-2 font-mono text-sm text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-delivery-fee"
                  className="block text-[11px] font-medium text-[#57534E] mb-1"
                >
                  Taxa de entrega (R$)
                </label>
                <input
                  id="cfg-delivery-fee"
                  type="number"
                  step="0.10"
                  min="0"
                  value={draft.deliveryFee}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      deliveryFee: parseDecimal(e.target.value, 0),
                    }))
                  }
                  className="w-full rounded-lg border border-[#D6D2C9] bg-[#FAF9F6] px-3 py-2 font-mono text-sm text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-free-threshold"
                  className="block text-[11px] font-medium text-[#57534E] mb-1"
                >
                  Grátis acima de (R$, 0 = off)
                </label>
                <input
                  id="cfg-free-threshold"
                  type="number"
                  step="1"
                  min="0"
                  value={draft.freeDeliveryThreshold}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      freeDeliveryThreshold: parseDecimal(e.target.value, 0),
                    }))
                  }
                  className="w-full rounded-lg border border-[#D6D2C9] bg-[#FAF9F6] px-3 py-2 font-mono text-sm text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-3">
            <h3 className="font-display text-sm font-bold text-[#171614]">
              Preços dos Sabores (R$)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { key: 'calabresa-queijo', label: 'Calabresa com Queijo' },
                  { key: 'frango-desfiado', label: 'Frango Desfiado' },
                  { key: 'bacon-queijo', label: 'Bacon com Queijo' },
                  { key: 'strogonofe-frango', label: 'Strogonoff de Frango' },
                  { key: 'strogonofe-carne', label: 'Strogonoff de Carne' },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E5E2DC]"
                >
                  <span className="text-xs font-semibold text-[#171614]">
                    {item.label}
                  </span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    aria-label={`Preço ${item.label}`}
                    value={draft.flavorPrices[item.key]}
                    onChange={(e) => updateFlavorPrice(item.key, e.target.value)}
                    className="w-24 rounded-md border border-[#D6D2C9] bg-white px-2.5 py-1.5 font-mono text-xs text-right text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-3">
            <h3 className="font-display text-sm font-bold text-[#171614]">
              Coberturas Cremosas (Catupiry / Cheddar)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { key: 'catupiry', label: 'Catupiry (adicional R$)' },
                  { key: 'cheddar', label: 'Cheddar (adicional R$)' },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E5E2DC]"
                >
                  <span className="text-xs font-semibold text-[#171614]">
                    {item.label}
                  </span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    aria-label={item.label}
                    value={draft.creamyPrices[item.key]}
                    onChange={(e) => updateCreamyPrice(item.key, e.target.value)}
                    className="w-24 rounded-md border border-[#D6D2C9] bg-white px-2.5 py-1.5 font-mono text-xs text-right text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-3">
            <h3 className="font-display text-sm font-bold text-[#171614]">
              Adicionais Disponíveis
            </h3>
            <div className="space-y-2">
              {draft.toppings.map((topping) => (
                <div
                  key={topping.id}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E5E2DC]"
                >
                  <input
                    type="text"
                    value={topping.name}
                    aria-label={`Nome do adicional ${topping.name}`}
                    onChange={(e) =>
                      updateToppingField(topping.id, 'name', e.target.value)
                    }
                    className="col-span-5 rounded-md border border-[#D6D2C9] bg-white px-2.5 py-1.5 text-xs font-medium text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                  />
                  <input
                    type="text"
                    value={topping.detail}
                    aria-label={`Detalhe de ${topping.name}`}
                    onChange={(e) =>
                      updateToppingField(topping.id, 'detail', e.target.value)
                    }
                    className="col-span-4 rounded-md border border-[#D6D2C9] bg-white px-2.5 py-1.5 text-xs text-[#57534E] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                  />
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    aria-label={`Preço de ${topping.name}`}
                    value={topping.price}
                    onChange={(e) =>
                      updateToppingField(topping.id, 'price', e.target.value)
                    }
                    className="col-span-2 rounded-md border border-[#D6D2C9] bg-white px-2 py-1.5 font-mono text-xs text-right text-[#171614] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopping(topping.id)}
                    aria-label={`Remover ${topping.name}`}
                    className="col-span-1 flex items-center justify-center p-1.5 text-[#78716C] hover:text-[#B91C1C] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#F0EDE6] space-y-2">
              <p className="text-[11px] font-semibold text-[#57534E]">
                Cadastrar novo adicional
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome (ex.: Catupiry Extra)"
                  className="sm:col-span-4 rounded-md border border-[#D6D2C9] bg-[#FAF9F6] px-2.5 py-1.5 text-xs text-[#171614]"
                />
                <input
                  type="text"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder="Descrição curta"
                  className="sm:col-span-3 rounded-md border border-[#D6D2C9] bg-[#FAF9F6] px-2.5 py-1.5 text-xs text-[#171614]"
                />
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as ToppingCategory)
                  }
                  className="sm:col-span-2 rounded-md border border-[#D6D2C9] bg-[#FAF9F6] px-2 py-1.5 text-xs text-[#171614]"
                >
                  <option value="Proteínas">Proteínas</option>
                  <option value="Queijos & Cremes">Queijos & Cremes</option>
                  <option value="Crocantes & Vegetais">
                    Crocantes & Vegetais
                  </option>
                </select>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="4.00"
                  className="sm:col-span-2 rounded-md border border-[#D6D2C9] bg-[#FAF9F6] px-2 py-1.5 font-mono text-xs text-right text-[#171614]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newName.trim()) return;
                    const created: ToppingItem = {
                      id: `addon-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 6)}`,
                      name: newName.trim(),
                      detail: newDetail.trim() || 'Adicional da casa',
                      category: newCategory,
                      price: parseDecimal(newPrice, 0),
                    };
                    setDraft((prev) => ({
                      ...prev,
                      toppings: [...prev.toppings, created],
                    }));
                    setNewName('');
                    setNewDetail('');
                    setNewPrice('4.00');
                  }}
                  aria-label="Adicionar novo item"
                  className="sm:col-span-1 rounded-md bg-[#171614] text-white py-1.5 px-2 flex items-center justify-center hover:bg-[#292524] cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-white border-t border-[#E5E2DC] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_STORE_CONFIG)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#171614] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Restaurar padrão</span>
          </button>

          <button
            type="submit"
            form="admin-config-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B45309] text-white text-xs sm:text-sm font-semibold hover:bg-[#92400E] transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>
              {savedNotice ? 'Configurações salvas!' : 'Salvar configurações'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
