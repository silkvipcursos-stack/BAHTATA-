import { FLAVORS } from '../data/menu';
import type {
  CreamyChoice,
  FlavorId,
  StoreConfig,
  StrogonoffProtein,
} from '../types';
import { formatBRL, getCreamyPrice, getFlavorPrice } from '../utils/pricing';
import { SafeImage } from './SafeImage';

export interface InlineFlavorSelection {
  flavorId: FlavorId;
  strogonoffProtein: StrogonoffProtein;
}

interface FlavorsSectionProps {
  pendingSelection: InlineFlavorSelection | null;
  storeConfig: StoreConfig;
  onSelectFlavor: (flavorId: FlavorId, protein?: StrogonoffProtein) => void;
  onSelectCheese: (
    flavorId: FlavorId,
    protein: StrogonoffProtein,
    cheese: CreamyChoice
  ) => void;
}

const CHEESE_OPTIONS: Array<{ id: CreamyChoice; label: string }> = [
  { id: 'catupiry', label: 'CATUPIRY' },
  { id: 'cheddar', label: 'CHEDDAR' },
  { id: 'catupiry-cheddar', label: 'CHEDDAR + CATUPIRY' },
];

export function FlavorsSection({
  pendingSelection,
  storeConfig,
  onSelectFlavor,
  onSelectCheese,
}: FlavorsSectionProps) {
  return (
    <section id="sabores" className="py-14 lg:py-18 border-b border-[#E5E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-[#B45309]">
              Sabores preparados na hora
            </p>
            <h2
              className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#171614]"
              style={{ textWrap: 'balance' }}
            >
              Escolha o sabor e o queijo da sua batata
            </h2>
          </div>

          <p className="text-sm text-[#57534E] max-w-md">
            Clique no sabor desejado e selecione entre Catupiry, Cheddar ou Cheddar + Catupiry para montar seu pedido.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {FLAVORS.map((flavor) => {
            const isCardSelected = pendingSelection?.flavorId === flavor.id;
            const singlePrice = getFlavorPrice(flavor.id, 'carne', storeConfig);
            const frangoPrice = getFlavorPrice('strogonofe', 'frango', storeConfig);
            const carnePrice = getFlavorPrice('strogonofe', 'carne', storeConfig);

            return (
              <article
                key={flavor.id}
                className={`group flex flex-col rounded-xl bg-white overflow-hidden transition-all duration-150 ${
                  isCardSelected
                    ? 'ring-2 ring-[#B45309] shadow-sm'
                    : 'border border-[#E5E2DC] hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                {!flavor.hasProteinChoice ? (
                  <button
                    type="button"
                    onClick={() => onSelectFlavor(flavor.id, 'carne')}
                    className="w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B45309]"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECEAE4]">
                      <SafeImage
                        src={flavor.image}
                        alt={`Batata recheada sabor ${flavor.name}`}
                        fallbackLabel={flavor.name}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>

                    <div className="p-5 pb-4">
                      <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1.5">
                        <span>{flavor.weightLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{flavor.prepTime}</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#171614] leading-snug">
                        {flavor.name}
                      </h3>

                      <div className="mt-4 pt-3 border-t border-[#F0EDE6] flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-[11px] text-[#78716C]">
                            A partir de
                          </span>
                          <span className="font-mono text-base font-semibold text-[#171614] tabular-nums">
                            {formatBRL(singlePrice)}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-semibold ${
                            isCardSelected ? 'text-[#B45309]' : 'text-[#57534E]'
                          }`}
                        >
                          {isCardSelected ? 'Selecionada' : 'Clique para selecionar'}
                        </span>
                      </div>
                    </div>
                  </button>
                ) : (
                  <>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECEAE4]">
                      <SafeImage
                        src={flavor.image}
                        alt={`Batata recheada sabor ${flavor.name}`}
                        fallbackLabel={flavor.name}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>

                    <div className="p-5 pb-4">
                      <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1.5">
                        <span>{flavor.weightLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{flavor.prepTime}</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#171614] leading-snug">
                        {flavor.name}
                      </h3>

                      <div className="mt-4 space-y-2">
                        {(
                          [
                            {
                              protein: 'frango' as const,
                              label: 'Strogonoff de Frango',
                              price: frangoPrice,
                            },
                            {
                              protein: 'carne' as const,
                              label: 'Strogonoff de Carne',
                              price: carnePrice,
                            },
                          ]
                        ).map((opt) => {
                          const active =
                            isCardSelected &&
                            pendingSelection?.strogonoffProtein === opt.protein;
                          return (
                            <button
                              key={opt.protein}
                              type="button"
                              onClick={() => onSelectFlavor('strogonofe', opt.protein)}
                              className={`w-full px-3 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                active
                                  ? 'border-[#B45309] bg-[#FEF7EE]'
                                  : 'border-[#E5E2DC] bg-[#FAF9F6] hover:border-[#B45309] hover:bg-[#FEF7EE]'
                              }`}
                            >
                              <span className="text-xs font-semibold text-[#171614]">
                                {opt.label}
                              </span>
                              <span className="font-mono text-xs font-semibold text-[#B45309] tabular-nums shrink-0">
                                {formatBRL(opt.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {isCardSelected && pendingSelection && (
                  <div className="px-5 pb-5 pt-3 border-t border-[#F0EDE6] bg-[#FAF9F6] space-y-2">
                    <span className="block text-[11px] font-bold text-[#B45309] tracking-wide">
                      ESCOLHA O QUEIJO PARA AVANÇAR:
                    </span>
                    <div className="space-y-1.5">
                      {CHEESE_OPTIONS.map((option) => {
                        const extra = getCreamyPrice(option.id, storeConfig);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              onSelectCheese(
                                pendingSelection.flavorId,
                                pendingSelection.strogonoffProtein,
                                option.id
                              )
                            }
                            className="w-full py-2.5 px-3 rounded-lg border border-[#E5E2DC] bg-white hover:border-[#B45309] hover:bg-[#FEF7EE] active:scale-[0.99] text-left flex items-center justify-between gap-2 transition-all cursor-pointer"
                          >
                            <span className="text-xs font-bold text-[#171614]">
                              {option.label}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#B45309] tabular-nums shrink-0">
                              {extra > 0 ? `+${formatBRL(extra)}` : 'Incluso'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
