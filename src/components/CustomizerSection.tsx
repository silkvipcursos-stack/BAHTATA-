import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import type { CartItem, PotatoConfig, StoreConfig } from '../types';
import { formatBRL } from '../utils/pricing';

interface CustomizerSectionProps {
  choices: CartItem[];
  activeChoiceUid: string | null;
  storeConfig: StoreConfig;
  onUpdateChoiceConfig: (uid: string, nextConfig: PotatoConfig) => void;
}

export function CustomizerSection({
  choices,
  activeChoiceUid,
  storeConfig,
  onUpdateChoiceConfig,
}: CustomizerSectionProps) {
  const [needsFlavorNotice, setNeedsFlavorNotice] = useState(false);

  const activeChoice = useMemo(() => {
    if (choices.length === 0) return null;
    return (
      choices.find((item) => item.uid === activeChoiceUid) ??
      choices[choices.length - 1]
    );
  }, [choices, activeChoiceUid]);

  const uniqueToppingIds = useMemo(
    () =>
      activeChoice ? Array.from(new Set(activeChoice.config.toppingIds)) : [],
    [activeChoice]
  );

  const toggleTopping = (id: string) => {
    if (!activeChoice) {
      setNeedsFlavorNotice(true);
      return;
    }
    setNeedsFlavorNotice(false);
    const next = uniqueToppingIds.includes(id)
      ? uniqueToppingIds.filter((t) => t !== id)
      : [...uniqueToppingIds, id];
    onUpdateChoiceConfig(activeChoice.uid, {
      ...activeChoice.config,
      toppingIds: next,
    });
  };

  return (
    <section
      id="personalizar"
      className="py-14 lg:py-20 bg-[#F2F0EB] border-b border-[#E5E2DC]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-[#E5E2DC] p-6 space-y-5">
          <h3 className="font-display text-lg font-bold text-[#171614]">
            Adicionais
          </h3>

          {needsFlavorNotice && !activeChoice && (
            <div className="p-3 rounded-lg bg-[#FEF7EE] border border-[#FDE6C4] flex items-center justify-between gap-3 text-xs text-[#92400E]">
              <span className="font-medium">
                Selecione primeiro o sabor e o queijo da sua batata acima para liberar os adicionais.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {storeConfig.toppings.map((topping) => {
              const isChecked = uniqueToppingIds.includes(topping.id);
              return (
                <button
                  key={topping.id}
                  type="button"
                  onClick={() => toggleTopping(topping.id)}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                    isChecked
                      ? 'border-[#B45309] bg-[#FEF7EE]'
                      : 'border-[#E5E2DC] bg-white hover:border-[#C7C2B8]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#171614] truncate">
                      {topping.name}
                    </p>
                    {topping.detail && (
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {topping.detail}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono text-xs font-semibold text-[#171614] tabular-nums">
                      +{formatBRL(topping.price)}
                    </span>
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-[#B45309] border-[#B45309] text-white'
                          : 'border-[#D6D2C9] bg-white'
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
