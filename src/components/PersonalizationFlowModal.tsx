import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { FLAVORS } from '../data/menu';
import type { CartItem, StoreConfig } from '../types';
import {
  calculateUnitPrice,
  formatBRL,
  getCreamyLabel,
  getFlavorDisplayName,
} from '../utils/pricing';

interface PersonalizationFlowModalProps {
  isOpen: boolean;
  choices: CartItem[];
  storeConfig: StoreConfig;
  onClose: () => void;
  onAddAnotherPotato: () => void;
  onContinueToToppings: () => void;
}

export function PersonalizationFlowModal({
  isOpen,
  choices,
  storeConfig,
  onClose,
  onAddAnotherPotato,
  onContinueToToppings,
}: PersonalizationFlowModalProps) {
  const [maxCardHeight, setMaxCardHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const updateViewportMetrics = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      if (vh > 0) {
        setMaxCardHeight(Math.max(240, Math.floor(vh * 0.84)));
      }
    };

    updateViewportMetrics();
    window.addEventListener('resize', updateViewportMetrics);
    window.visualViewport?.addEventListener('resize', updateViewportMetrics);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', updateViewportMetrics);
      window.visualViewport?.removeEventListener('resize', updateViewportMetrics);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || choices.length === 0 || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/55 backdrop-blur-[2px] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-another-potato-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={maxCardHeight ? { maxHeight: `${maxCardHeight}px` } : undefined}
        className="w-full max-w-[348px] sm:max-w-[440px] max-h-[84svh] bg-[#FAF9F6] rounded-2xl border border-[#E5E2DC] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="px-3.5 py-3 sm:px-5 sm:py-4 bg-white border-b border-[#E5E2DC] flex items-center gap-2.5 sm:gap-3 shrink-0">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#15803D] shrink-0">
            <Check className="w-4 h-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-semibold text-[#15803D] leading-tight">
              Batata registrada no seu pedido
            </p>
            <h2
              id="add-another-potato-title"
              className="mt-0.5 font-display text-sm sm:text-base font-bold text-[#171614] leading-snug"
            >
              DESEJA ADICIONAR OUTRA BATATA RECHEADA?
            </h2>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-2.5 sm:px-5 sm:py-3.5 space-y-2 overscroll-contain">
          {choices.map((item, idx) => {
            const flavor =
              FLAVORS.find((f) => f.id === item.config.flavorId) ?? FLAVORS[0];
            const flavorName = getFlavorDisplayName(
              flavor,
              item.config.strogonoffProtein
            );
            const cheeseName = getCreamyLabel(item.config.creamyChoice);
            const linePrice =
              Math.round(
                calculateUnitPrice(item.config, storeConfig) *
                  item.quantity *
                  100
              ) / 100;

            return (
              <div
                key={item.uid}
                className="px-3 py-2 sm:p-3 rounded-xl bg-white border border-[#E5E2DC] flex items-center justify-between gap-2.5"
              >
                <div className="min-w-0">
                  <span className="block font-mono text-[10px] sm:text-[11px] font-bold text-[#B45309] leading-tight">
                    Batata {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#171614] truncate">
                    {flavorName} + {cheeseName}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#171614] tabular-nums shrink-0">
                  {formatBRL(linePrice)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="px-3.5 py-3 sm:px-5 sm:py-4 bg-white border-t border-[#E5E2DC] grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddAnotherPotato}
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl border border-[#D6D2C9] bg-[#FAF9F6] text-xs font-bold text-[#171614] hover:border-[#171614] hover:bg-[#F3F1EC] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>ADICIONAR OUTRA BATATA</span>
          </button>

          <button
            type="button"
            onClick={onContinueToToppings}
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-[#B45309] text-white text-xs font-bold hover:bg-[#92400E] active:scale-[0.99] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B45309]"
          >
            <span>CONTINUAR PARA ADICIONAIS</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
