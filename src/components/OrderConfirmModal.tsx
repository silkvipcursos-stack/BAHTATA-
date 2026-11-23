import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  MessageCircle,
  Store,
  Truck,
  Utensils,
  X,
} from 'lucide-react';
import { FLAVORS } from '../data/menu';
import type { CartItem, DeliveryMode, StoreConfig } from '../types';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  calculateDeliveryFee,
  calculateUnitPrice,
  formatBRL,
  getCreamyLabel,
  getCreamyPrice,
  getFlavorDisplayName,
  getFlavorPrice,
  type WhatsAppExtraAddon,
} from '../utils/pricing';

interface OrderConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  mode: DeliveryMode;
  onChangeMode: (mode: DeliveryMode) => void;
  storeConfig: StoreConfig;
  onConfirmWhatsApp?: () => void;
}

function getAuthorizedCustomerName(): string {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    const paramName = params.get('nome') ?? params.get('name') ?? '';
    return paramName.trim();
  } catch {
    return '';
  }
}

export function OrderConfirmModal({
  isOpen,
  onClose,
  items,
  mode,
  onChangeMode,
  storeConfig,
  onConfirmWhatsApp,
}: OrderConfirmModalProps) {
  const customerName = getAuthorizedCustomerName();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || items.length === 0 || typeof document === 'undefined') {
    return null;
  }

  const addonAccumulator = new Map<string, WhatsAppExtraAddon>();

  const lineItems = items.map((item) => {
    const flavor =
      FLAVORS.find((f) => f.id === item.config.flavorId) ?? FLAVORS[0];
    const unitPrice = calculateUnitPrice(item.config, storeConfig);
    const basePlusCheeseUnit =
      getFlavorPrice(
        item.config.flavorId,
        item.config.strogonoffProtein,
        storeConfig
      ) + getCreamyPrice(item.config.creamyChoice, storeConfig);
    const cheeseName = getCreamyLabel(item.config.creamyChoice);
    const uniqueToppings = Array.from(new Set(item.config.toppingIds))
      .map((id) => storeConfig.toppings.find((t) => t.id === id))
      .filter((topping): topping is NonNullable<typeof topping> =>
        Boolean(topping)
      );

    uniqueToppings.forEach((topping) => {
      const existing = addonAccumulator.get(topping.id);
      const addedTotal = Math.round(topping.price * item.quantity * 100) / 100;
      if (existing) {
        existing.quantity += item.quantity;
        existing.total =
          Math.round((existing.total + addedTotal) * 100) / 100;
      } else {
        addonAccumulator.set(topping.id, {
          name: topping.name,
          quantity: item.quantity,
          total: addedTotal,
        });
      }
    });

    return {
      productName: 'Batata recheada artesanal',
      flavorName: getFlavorDisplayName(flavor, item.config.strogonoffProtein),
      cheeseName,
      addons: uniqueToppings.map((t) => t.name),
      quantity: item.quantity,
      baseTotal: Math.round(basePlusCheeseUnit * item.quantity * 100) / 100,
      lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
    };
  });

  const extraAddons = Array.from(addonAccumulator.values());

  const subtotal =
    Math.round(lineItems.reduce((sum, item) => sum + item.lineTotal, 0) * 100) /
    100;
  const deliveryFee = calculateDeliveryFee(subtotal, mode, storeConfig);
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;
  const message = buildWhatsAppMessage({
    customerName,
    items: lineItems.map((item) => ({
      productName: item.productName,
      flavorName: item.flavorName,
      cheeseName: item.cheeseName,
      quantity: item.quantity,
      baseTotal: item.baseTotal,
    })),
    extraAddons,
    mode,
    deliveryFee,
    total,
  });
  const whatsappUrl = buildWhatsAppUrl(storeConfig.whatsappNumber, message);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] h-dvh w-full overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirm-heading"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-full w-full items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl max-h-[calc(100dvh-2rem)] my-auto bg-[#FAF9F6] rounded-2xl border border-[#E5E2DC] shadow-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-5 bg-white border-b border-[#E5E2DC] flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#FEF7EE] border border-[#FDE6C4] flex items-center justify-center shrink-0">
                <Utensils
                  className="w-5 h-5 text-[#B45309]"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-xs font-semibold text-[#B45309]">
                  +BAHTATA RECHEADA
                </p>
                <h2
                  id="order-confirm-heading"
                  className="font-display text-lg sm:text-xl font-bold text-[#171614] leading-snug"
                >
                  SEU PEDIDO ESTÁ QUASE PRONTO!
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar janela de confirmação"
              className="w-9 h-9 rounded-lg border border-[#E5E2DC] flex items-center justify-center text-[#57534E] hover:text-[#171614] hover:bg-[#F3F1EC] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="space-y-3">
              {lineItems.map((item, idx) => {
                const code = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={`confirm-item-${idx}`}
                    className="p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-[#F0EDE6] pb-2">
                      <div>
                        <span className="block text-[11px] font-bold text-[#B45309]">
                          BATATA {code}
                        </span>
                        <p className="text-xs text-[#78716C]">
                          {item.productName}
                        </p>
                        <h3 className="font-display text-base font-bold text-[#171614]">
                          {item.flavorName}
                        </h3>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#171614] tabular-nums shrink-0">
                        {formatBRL(item.lineTotal)}
                      </span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <dt className="text-[#78716C]">Adicionais</dt>
                        <dd className="font-medium text-[#171614] mt-0.5">
                          {item.cheeseName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#78716C]">Quantidade</dt>
                        <dd className="font-mono font-semibold text-[#171614] tabular-nums mt-0.5">
                          {item.quantity}{' '}
                          {item.quantity === 1 ? 'unidade' : 'unidades'}
                        </dd>
                      </div>
                      {item.addons.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-[#78716C]">Adicionais extras</dt>
                          <dd className="font-medium text-[#171614] mt-0.5">
                            {item.addons.join(', ')}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E5E2DC] space-y-3">
              <p className="text-xs font-semibold text-[#171614]">
                Tipo de recebimento
              </p>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#F3F1EC]">
                <button
                  type="button"
                  onClick={() => onChangeMode('delivery')}
                  className={`py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    mode === 'delivery'
                      ? 'bg-white text-[#171614] shadow-xs'
                      : 'text-[#57534E] hover:text-[#171614]'
                  }`}
                >
                  <Truck className="w-4 h-4" aria-hidden="true" />
                  <span>Entrega</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMode('pickup')}
                  className={`py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    mode === 'pickup'
                      ? 'bg-white text-[#171614] shadow-xs'
                      : 'text-[#57534E] hover:text-[#171614]'
                  }`}
                >
                  <Store className="w-4 h-4" aria-hidden="true" />
                  <span>Retirada (Grátis)</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#F0EDE6] space-y-1.5 text-xs text-[#57534E]">
                <div className="flex items-center justify-between">
                  <span>Subtotal das escolhas</span>
                  <span className="font-mono text-[#171614] tabular-nums">
                    {formatBRL(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {mode === 'pickup'
                      ? 'Retirada no balcão'
                      : 'Taxa de entrega'}
                  </span>
                  <span className="font-mono text-[#171614] tabular-nums">
                    {deliveryFee === 0
                      ? 'R$ 0,00 (Grátis)'
                      : formatBRL(deliveryFee)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#171614] text-white flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#D6D2C9]">Valor total do pedido</p>
                <p className="text-[11px] text-[#A8A29E] mt-0.5">
                  {mode === 'delivery'
                    ? 'Para entrega'
                    : 'Para retirada no balcão'}
                </p>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#FCD34D] tabular-nums">
                {formatBRL(total)}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white border-t border-[#E5E2DC] flex flex-col-reverse sm:flex-row items-stretch gap-3">
            <button
              type="button"
              onClick={onClose}
              className="sm:w-2/5 py-3.5 px-4 rounded-xl border border-[#D6D2C9] bg-[#FAF9F6] text-xs sm:text-sm font-semibold text-[#171614] hover:border-[#171614] hover:bg-[#F3F1EC] inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>VOLTAR E EDITAR</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onConfirmWhatsApp?.()}
              className="sm:w-3/5 py-3.5 px-5 rounded-xl bg-[#15803D] text-white text-xs sm:text-sm font-bold hover:bg-[#166534] active:scale-[0.99] inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>CONFIRMAR E ENVIAR PELO WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
