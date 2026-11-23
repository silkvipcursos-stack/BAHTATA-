import { CircleCheck, Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import { FLAVORS } from '../data/menu';
import type { CartItem, StoreConfig } from '../types';
import {
  calculateUnitPrice,
  formatBRL,
  getCreamyLabel,
  getFlavorDisplayName,
} from '../utils/pricing';

interface MyChoicesSectionProps {
  items: CartItem[];
  storeConfig: StoreConfig;
  editingUid: string | null;
  onEditItem: (uid: string) => void;
  onRemoveItem: (uid: string) => void;
  onUpdateQuantity: (uid: string, delta: number) => void;
  onChooseAnother: () => void;
  onFinalizeOrder: () => void;
  onScrollToChoices: () => void;
}

export function MyChoicesSection({
  items,
  storeConfig,
  editingUid,
  onEditItem,
  onRemoveItem,
  onUpdateQuantity,
  onChooseAnother,
  onFinalizeOrder,
  onScrollToChoices,
}: MyChoicesSectionProps) {
  const itemPrices = items.map((item) =>
    calculateUnitPrice(item.config, storeConfig)
  );
  const totalAmount =
    Math.round(
      items.reduce(
        (sum, item, idx) => sum + itemPrices[idx] * item.quantity,
        0
      ) * 100
    ) / 100;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <section
        id="minhas-escolhas"
        className={`py-14 lg:py-20 bg-[#F8F7F4] border-b border-[#E5E2DC] ${
          items.length > 0 ? 'pb-28 md:pb-14 lg:pb-20' : ''
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-[#B45309]">
                Resumo do seu pedido em tempo real
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#171614]">
                MINHAS ESCOLHAS 🥔
              </h2>
            </div>

            {items.length > 0 && (
              <div className="text-left sm:text-right">
                <p className="text-xs text-[#78716C]">
                  {totalUnits}{' '}
                  {totalUnits === 1 ? 'unidade selecionada' : 'unidades selecionadas'}
                </p>
                <p className="font-mono text-lg font-bold text-[#171614] tabular-nums">
                  {formatBRL(totalAmount)}
                </p>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl bg-white border border-[#E5E2DC] p-8 sm:p-10 text-center">
              <p className="font-display text-xl font-bold text-[#171614]">
                Nenhuma batata adicionada ainda
              </p>
              <p className="mt-2 text-sm text-[#57534E] max-w-md mx-auto">
                Escolha um sabor acima, selecione o queijo desejado (Catupiry, Cheddar ou os dois) e personalize seus adicionais.
              </p>
              <button
                type="button"
                onClick={onChooseAnother}
                className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#B45309] text-white text-sm font-semibold hover:bg-[#92400E] transition-colors cursor-pointer"
              >
                + ESCOLHER OUTRA BATATA
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, idx) => {
                  const unitPrice = itemPrices[idx];
                  const lineTotal =
                    Math.round(unitPrice * item.quantity * 100) / 100;
                  const flavor =
                    FLAVORS.find((f) => f.id === item.config.flavorId) ??
                    FLAVORS[0];
                  const flavorName = getFlavorDisplayName(
                    flavor,
                    item.config.strogonoffProtein
                  );
                  const cheeseName = getCreamyLabel(item.config.creamyChoice);
                  const selectedToppings = Array.from(
                    new Set(item.config.toppingIds)
                  )
                    .map((id) => storeConfig.toppings.find((t) => t.id === id))
                    .filter((topping): topping is NonNullable<typeof topping> =>
                      Boolean(topping)
                    );
                  const code = String(idx + 1).padStart(2, '0');
                  const isBeingEdited = editingUid === item.uid;

                  return (
                    <article
                      key={item.uid}
                      className={`rounded-xl bg-white p-5 flex flex-col justify-between gap-4 transition-all ${
                        isBeingEdited
                          ? 'ring-2 ring-[#B45309] shadow-sm'
                          : 'border border-[#E5E2DC]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EDE6]">
                          <div>
                            <span className="inline-block font-mono text-xs font-bold text-[#B45309] tracking-wide">
                              BATATA {code}
                            </span>
                            {isBeingEdited && (
                              <span className="ml-2 text-[11px] font-semibold text-[#92400E] bg-[#FEF7EE] px-2 py-0.5 rounded">
                                Selecionada
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-base font-bold text-[#171614] tabular-nums">
                            {formatBRL(lineTotal)}
                          </span>
                        </div>

                        <ul className="space-y-1.5 text-sm text-[#57534E]">
                          <li>
                            <span className="font-semibold text-[#171614]">
                              Sabor:
                            </span>{' '}
                            {flavorName}
                          </li>
                          <li>
                            <span className="font-semibold text-[#171614]">
                              Queijo:
                            </span>{' '}
                            {cheeseName}
                          </li>
                          {selectedToppings.length > 0 && (
                            <li>
                              <span className="font-semibold text-[#171614]">
                                Adicionais:
                              </span>{' '}
                              {selectedToppings
                                .map((topping) => {
                                  const toppingTotal =
                                    Math.round(
                                      topping.price * item.quantity * 100
                                    ) / 100;
                                  return `${item.quantity}x ${topping.name} (${formatBRL(toppingTotal)})`;
                                })
                                .join(', ')}
                            </li>
                          )}
                          {item.config.notes.trim() && (
                            <li>
                              <span className="font-semibold text-[#171614]">
                                Observações:
                              </span>{' '}
                              {item.config.notes.trim()}
                            </li>
                          )}
                          <li>
                            <span className="font-semibold text-[#171614]">
                              Quantidade:
                            </span>{' '}
                            <span className="font-mono tabular-nums">
                              {item.quantity}
                            </span>
                          </li>
                          <li>
                            <span className="font-semibold text-[#171614]">
                              Valor:
                            </span>{' '}
                            <span className="font-mono font-semibold text-[#171614] tabular-nums">
                              {formatBRL(lineTotal)}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-[#F0EDE6] flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center border border-[#D6D2C9] rounded-lg bg-[#FAF9F6]">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade da BATATA ${code}`}
                            onClick={() => onUpdateQuantity(item.uid, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[#171614] hover:bg-[#EFECE6] rounded-l-lg transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums text-[#171614]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade da BATATA ${code}`}
                            onClick={() => onUpdateQuantity(item.uid, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#171614] hover:bg-[#EFECE6] rounded-r-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onEditItem(item.uid)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6D2C9] bg-[#FAF9F6] text-xs font-semibold text-[#171614] hover:border-[#171614] transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.uid)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Remover</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-white border border-[#E5E2DC] p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EDE6]">
                  <span className="font-display text-lg sm:text-xl font-bold text-[#171614]">
                    TOTAL DO SEU PEDIDO:
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#B45309] tabular-nums">
                    {formatBRL(totalAmount)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <button
                    type="button"
                    onClick={onChooseAnother}
                    className="sm:w-1/2 py-3.5 px-5 rounded-xl border border-[#D6D2C9] bg-[#FAF9F6] text-sm font-semibold text-[#171614] hover:border-[#171614] hover:bg-[#F3F1EC] transition-colors cursor-pointer"
                  >
                    + ESCOLHER OUTRA BATATA
                  </button>

                  <button
                    type="button"
                    onClick={onFinalizeOrder}
                    className="sm:w-1/2 py-3.5 px-5 rounded-xl bg-[#B45309] text-white text-sm font-bold hover:bg-[#92400E] active:scale-[0.99] inline-flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B45309]"
                  >
                    <CircleCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>FINALIZAR MEU PEDIDO</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-sm border-t border-[#E5E2DC] px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-[#78716C]">
                TOTAL DO SEU PEDIDO
              </p>
              <p className="font-mono text-lg font-bold text-[#171614] tabular-nums">
                {formatBRL(totalAmount)}
              </p>
            </div>

            <button
              type="button"
              onClick={onScrollToChoices}
              className="px-4 py-2.5 rounded-lg bg-[#B45309] text-white text-xs font-bold hover:bg-[#92400E] transition-colors whitespace-nowrap cursor-pointer"
            >
              Ver escolhas ({totalUnits})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
