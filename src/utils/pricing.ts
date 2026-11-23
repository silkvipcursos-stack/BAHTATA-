import {
  DEFAULT_STORE_CONFIG,
  EXCLUSIVES,
  GRATINS,
  SAUCES,
  SIZES,
  STORE_CONFIG_STORAGE_KEY,
} from '../data/menu';
import type {
  CreamyChoice,
  DeliveryMode,
  FlavorId,
  FlavorItem,
  PotatoConfig,
  StoreConfig,
  StrogonoffProtein,
  ToppingItem,
} from '../types';

export function sanitizePositiveNumber(value: unknown, fallback: number): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return fallback;
  }
  return Math.round(num * 100) / 100;
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function loadStoreConfig(): StoreConfig {
  try {
    const raw = window.localStorage.getItem(STORE_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_CONFIG;
    const parsed = JSON.parse(raw);

    const toppings: ToppingItem[] = Array.isArray(parsed.toppings)
      ? parsed.toppings
          .filter(
            (item: unknown): item is ToppingItem =>
              Boolean(
                item &&
                  typeof (item as ToppingItem).id === 'string' &&
                  typeof (item as ToppingItem).name === 'string'
              )
          )
          .map((item: ToppingItem) => ({
            id: item.id,
            name: item.name.trim() || 'Adicional',
            category:
              item.category === 'Proteínas' ||
              item.category === 'Queijos & Cremes' ||
              item.category === 'Crocantes & Vegetais'
                ? item.category
                : 'Crocantes & Vegetais',
            price: sanitizePositiveNumber(item.price, 0),
            detail: typeof item.detail === 'string' ? item.detail : '',
          }))
      : DEFAULT_STORE_CONFIG.toppings;

    return {
      whatsappNumber:
        typeof parsed.whatsappNumber === 'string' &&
        onlyDigits(parsed.whatsappNumber).length >= 10
          ? onlyDigits(parsed.whatsappNumber)
          : DEFAULT_STORE_CONFIG.whatsappNumber,
      deliveryFee: sanitizePositiveNumber(
        parsed.deliveryFee,
        DEFAULT_STORE_CONFIG.deliveryFee
      ),
      freeDeliveryThreshold: sanitizePositiveNumber(
        parsed.freeDeliveryThreshold,
        DEFAULT_STORE_CONFIG.freeDeliveryThreshold
      ),
      flavorPrices: {
        'calabresa-queijo': sanitizePositiveNumber(
          parsed.flavorPrices?.['calabresa-queijo'],
          DEFAULT_STORE_CONFIG.flavorPrices['calabresa-queijo']
        ),
        'frango-desfiado': sanitizePositiveNumber(
          parsed.flavorPrices?.['frango-desfiado'],
          DEFAULT_STORE_CONFIG.flavorPrices['frango-desfiado']
        ),
        'bacon-queijo': sanitizePositiveNumber(
          parsed.flavorPrices?.['bacon-queijo'],
          DEFAULT_STORE_CONFIG.flavorPrices['bacon-queijo']
        ),
        'strogonofe-frango': sanitizePositiveNumber(
          parsed.flavorPrices?.['strogonofe-frango'],
          DEFAULT_STORE_CONFIG.flavorPrices['strogonofe-frango']
        ),
        'strogonofe-carne': sanitizePositiveNumber(
          parsed.flavorPrices?.['strogonofe-carne'],
          DEFAULT_STORE_CONFIG.flavorPrices['strogonofe-carne']
        ),
      },
      creamyPrices: {
        catupiry: sanitizePositiveNumber(
          parsed.creamyPrices?.catupiry,
          DEFAULT_STORE_CONFIG.creamyPrices.catupiry
        ),
        cheddar: sanitizePositiveNumber(
          parsed.creamyPrices?.cheddar,
          DEFAULT_STORE_CONFIG.creamyPrices.cheddar
        ),
      },
      toppings,
    };
  } catch {
    return DEFAULT_STORE_CONFIG;
  }
}

export function saveStoreConfig(config: StoreConfig): void {
  try {
    window.localStorage.setItem(STORE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

export function getFlavorPrice(
  flavorId: FlavorId,
  strogonoffProtein: StrogonoffProtein,
  config: StoreConfig = DEFAULT_STORE_CONFIG
): number {
  if (flavorId === 'strogonofe') {
    return strogonoffProtein === 'frango'
      ? config.flavorPrices['strogonofe-frango']
      : config.flavorPrices['strogonofe-carne'];
  }
  return config.flavorPrices[flavorId];
}

export function getFlavorDisplayName(
  flavor: FlavorItem,
  strogonoffProtein: StrogonoffProtein
): string {
  if (flavor.id === 'strogonofe') {
    return strogonoffProtein === 'frango'
      ? 'Strogonoff de Frango'
      : 'Strogonoff de Carne';
  }
  return flavor.name;
}

export function getCreamyPrice(
  creamyChoice: CreamyChoice,
  storeConfig: StoreConfig = DEFAULT_STORE_CONFIG
): number {
  if (creamyChoice === 'catupiry-cheddar') {
    return (
      (storeConfig.creamyPrices.catupiry ?? 0) +
      (storeConfig.creamyPrices.cheddar ?? 0)
    );
  }
  return storeConfig.creamyPrices[creamyChoice] ?? 0;
}

export function getCreamyLabel(creamyChoice: CreamyChoice): string {
  if (creamyChoice === 'catupiry-cheddar') return 'Cheddar + Catupiry';
  return creamyChoice === 'cheddar' ? 'Cheddar' : 'Catupiry';
}

export function getFullPotatoLabel(flavor: FlavorItem, config: PotatoConfig): string {
  const creamy = getCreamyLabel(config.creamyChoice);
  return `${getFlavorDisplayName(flavor, config.strogonoffProtein)} + ${creamy}`;
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDecimalBR(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calculateUnitPrice(
  config: PotatoConfig,
  storeConfig: StoreConfig = DEFAULT_STORE_CONFIG
): number {
  const base = getFlavorPrice(config.flavorId, config.strogonoffProtein, storeConfig);
  const creamy = getCreamyPrice(config.creamyChoice, storeConfig);
  const size = SIZES.find((s) => s.id === config.sizeId) ?? SIZES[0];
  const gratin = GRATINS.find((g) => g.id === config.gratinId) ?? GRATINS[0];

  const toppingsTotal = Array.from(new Set(config.toppingIds)).reduce((sum, id) => {
    const found = storeConfig.toppings.find((t) => t.id === id);
    return sum + (found ? found.price : 0);
  }, 0);

  const saucesTotal = Array.from(new Set(config.sauceIds)).reduce(
    (sum, id, index) => {
      if (index === 0) return sum;
      const found = SAUCES.find((s) => s.id === id);
      return sum + (found ? found.price : 0);
    },
    0
  );

  const exclusivesTotal = Array.from(new Set(config.exclusiveIds)).reduce((sum, id) => {
    const found = EXCLUSIVES.find((ex) => ex.id === id);
    return sum + (found ? found.price : 0);
  }, 0);

  const total =
    base + creamy + size.extraPrice + gratin.extraPrice + toppingsTotal + saucesTotal + exclusivesTotal;
  return Math.round(total * 100) / 100;
}

export function calculateDeliveryFee(
  subtotal: number,
  mode: DeliveryMode,
  storeConfig: StoreConfig
): number {
  if (
    mode === 'pickup' ||
    subtotal <= 0 ||
    (storeConfig.freeDeliveryThreshold > 0 &&
      subtotal >= storeConfig.freeDeliveryThreshold)
  ) {
    return 0;
  }
  return storeConfig.deliveryFee;
}

export interface WhatsAppExtraAddon {
  name: string;
  quantity: number;
  total: number;
}

export interface WhatsAppOrderLineItem {
  productName: string;
  flavorName: string;
  cheeseName: string;
  quantity: number;
  baseTotal: number;
}

export function buildWhatsAppMessage(params: {
  customerName?: string;
  items: WhatsAppOrderLineItem[];
  extraAddons: WhatsAppExtraAddon[];
  mode: DeliveryMode;
  deliveryFee: number;
  total: number;
}): string {
  const { customerName, items, extraAddons, mode, deliveryFee, total } = params;
  const trimmedName = customerName?.trim() ?? '';
  const greeting = trimmedName
    ? `Olá, ${trimmedName}! Venha fazer seu pedido na +BAHTATA RECHEADA.`
    : 'Olá! Venha fazer seu pedido na +BAHTATA RECHEADA.';

  const modeLabel = mode === 'delivery' ? 'Entrega' : 'Retirada no balcão';
  const feeText = formatDecimalBR(deliveryFee);
  const totalText = formatDecimalBR(total);

  const lines: string[] = [greeting, '', '*MEU PEDIDO*', ''];

  items.forEach((item, index) => {
    const code = String(index + 1).padStart(2, '0');
    const unitLabel = item.quantity === 1 ? 'unidade' : 'unidades';
    lines.push(
      `*BATATA ${code}*`,
      `Produto: ${item.productName}`,
      `Sabor: ${item.flavorName}`,
      `Preferência: ${item.cheeseName}`,
      `Quantidade: ${item.quantity} ${unitLabel}`,
      `Valor: R$ ${formatDecimalBR(item.baseTotal)}`,
      ''
    );
  });

  if (extraAddons.length > 0) {
    lines.push('*ADICIONAIS EXTRAS*');
    extraAddons.forEach((addon) => {
      const portionLabel = addon.quantity === 1 ? 'porção' : 'porções';
      lines.push(
        `${addon.name}: ${addon.quantity} ${portionLabel} (R$ ${formatDecimalBR(addon.total)})`
      );
    });
    lines.push('');
  }

  lines.push(
    `Recebimento: ${modeLabel}`,
    `Taxa de entrega: R$ ${feeText}`,
    '',
    `*VALOR TOTAL: R$ ${totalText}*`,
    '',
    'PAGAMENTO VIA PIX',
    'Chave Pix: 02556224061',
    '',
    'Após realizar o pagamento, envie o comprovante aqui pelo WhatsApp para confirmarmos seu pedido.'
  );

  return lines.join('\n');
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = onlyDigits(phoneNumber) || '5554984161837';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
