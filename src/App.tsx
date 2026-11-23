import { useEffect, useState } from 'react';
import { AdminModal } from './components/AdminModal';
import { CustomizerSection } from './components/CustomizerSection';
import {
  FlavorsSection,
  type InlineFlavorSelection,
} from './components/FlavorsSection';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MyChoicesSection } from './components/MyChoicesSection';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { PersonalizationFlowModal } from './components/PersonalizationFlowModal';
import {
  CAXIAS_DO_SUL_RECENT_ORDERS,
  RecentOrderNotifications,
} from './components/RecentOrderNotifications';
import { INITIAL_CONFIG } from './data/menu';
import type {
  AuthorizedRecentOrder,
  CartItem,
  CreamyChoice,
  DeliveryMode,
  FlavorId,
  PotatoConfig,
  StoreConfig,
  StrogonoffProtein,
} from './types';
import {
  calculateUnitPrice,
  loadStoreConfig,
  saveStoreConfig,
} from './utils/pricing';

function loadAuthorizedRecentOrders(): AuthorizedRecentOrder[] {
  if (typeof window === 'undefined') return CAXIAS_DO_SUL_RECENT_ORDERS;
  try {
    const raw = window.localStorage.getItem(
      'bahtata_recheada_authorized_orders_v1'
    );
    if (!raw) return CAXIAS_DO_SUL_RECENT_ORDERS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return CAXIAS_DO_SUL_RECENT_ORDERS;
    }
    const valid = parsed.filter(
      (item: unknown): item is AuthorizedRecentOrder =>
        Boolean(
          item &&
            (item as AuthorizedRecentOrder).authorized === true &&
            typeof (item as AuthorizedRecentOrder).id === 'string' &&
            typeof (item as AuthorizedRecentOrder).firstName === 'string' &&
            (item as AuthorizedRecentOrder).firstName.trim().length > 0 &&
            typeof (item as AuthorizedRecentOrder).neighborhood === 'string' &&
            (item as AuthorizedRecentOrder).neighborhood.trim().length > 0
        )
    );
    return valid.length > 0 ? valid : CAXIAS_DO_SUL_RECENT_ORDERS;
  } catch {
    return CAXIAS_DO_SUL_RECENT_ORDERS;
  }
}

export default function App() {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() =>
    loadStoreConfig()
  );
  const [recentOrders] = useState<AuthorizedRecentOrder[]>(() =>
    loadAuthorizedRecentOrders()
  );
  const [choices, setChoices] = useState<CartItem[]>([]);
  const [activeChoiceUid, setActiveChoiceUid] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] =
    useState<InlineFlavorSelection | null>(null);
  const [isAddAnotherOpen, setIsAddAnotherOpen] = useState(false);
  const [mode, setMode] = useState<DeliveryMode>('delivery');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.removeItem('bahtata_recheada_choices_v1');
      window.localStorage.removeItem('bahtata_recheada_cart_v1');
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSaveStoreConfig = (nextConfig: StoreConfig) => {
    setStoreConfig(nextConfig);
    saveStoreConfig(nextConfig);
    setChoices((prev) =>
      prev.map((item) => ({
        ...item,
        unitPrice: calculateUnitPrice(item.config, nextConfig),
      }))
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectFlavor = (
    flavorId: FlavorId,
    protein: StrogonoffProtein = 'carne'
  ) => {
    setPendingSelection({ flavorId, strogonoffProtein: protein });
  };

  const handleConfirmFlavorAndCheese = (
    flavorId: FlavorId,
    protein: StrogonoffProtein,
    cheese: CreamyChoice
  ) => {
    const newConfig: PotatoConfig = {
      ...INITIAL_CONFIG,
      flavorId,
      strogonoffProtein: protein,
      creamyChoice: cheese,
      toppingIds: [],
      sauceIds: [],
      exclusiveIds: [],
      notes: '',
    };

    const newItem: CartItem = {
      uid: `batata-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      config: newConfig,
      quantity: 1,
      unitPrice: calculateUnitPrice(newConfig, storeConfig),
    };

    setChoices((prev) => [...prev, newItem]);
    setActiveChoiceUid(newItem.uid);
    setPendingSelection(null);
    setIsAddAnotherOpen(true);
  };

  const handleAddAnotherPotato = () => {
    setIsAddAnotherOpen(false);
    setPendingSelection(null);
    scrollToSection('sabores');
  };

  const handleContinueToToppings = () => {
    setIsAddAnotherOpen(false);
    scrollToSection('personalizar');
  };

  const handleUpdateChoiceConfig = (uid: string, nextConfig: PotatoConfig) => {
    const normalized: PotatoConfig = {
      ...nextConfig,
      toppingIds: Array.from(new Set(nextConfig.toppingIds)),
      sauceIds: Array.from(new Set(nextConfig.sauceIds)),
      exclusiveIds: Array.from(new Set(nextConfig.exclusiveIds)),
    };
    const unitPrice = calculateUnitPrice(normalized, storeConfig);

    setChoices((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, config: normalized, unitPrice } : item
      )
    );
  };

  const handleEditChoice = (uid: string) => {
    setActiveChoiceUid(uid);
    scrollToSection('personalizar');
  };

  const handleUpdateChoiceQuantity = (uid: string, delta: number) => {
    setChoices((prev) => {
      const updated = prev
        .map((item) =>
          item.uid === uid
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);

      if (
        activeChoiceUid === uid &&
        !updated.some((item) => item.uid === uid)
      ) {
        setActiveChoiceUid(
          updated.length > 0 ? updated[updated.length - 1].uid : null
        );
      }

      return updated;
    });
  };

  const handleRemoveChoice = (uid: string) => {
    setChoices((prev) => {
      const remaining = prev.filter((item) => item.uid !== uid);
      if (activeChoiceUid === uid) {
        setActiveChoiceUid(
          remaining.length > 0 ? remaining[remaining.length - 1].uid : null
        );
      }
      return remaining;
    });
  };

  const handleFinalizeOrder = () => {
    if (choices.length === 0) return;
    setIsConfirmOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#171614]">
      <Header />

      <main className="flex-1">
        <Hero onStartCustomizing={() => scrollToSection('sabores')} />

        <FlavorsSection
          pendingSelection={pendingSelection}
          storeConfig={storeConfig}
          onSelectFlavor={handleSelectFlavor}
          onSelectCheese={handleConfirmFlavorAndCheese}
        />

        <CustomizerSection
          choices={choices}
          activeChoiceUid={activeChoiceUid}
          storeConfig={storeConfig}
          onUpdateChoiceConfig={handleUpdateChoiceConfig}
        />

        <MyChoicesSection
          items={choices}
          storeConfig={storeConfig}
          editingUid={activeChoiceUid}
          onEditItem={handleEditChoice}
          onRemoveItem={handleRemoveChoice}
          onUpdateQuantity={handleUpdateChoiceQuantity}
          onChooseAnother={handleAddAnotherPotato}
          onFinalizeOrder={handleFinalizeOrder}
          onScrollToChoices={() => scrollToSection('minhas-escolhas')}
        />
      </main>

      <PersonalizationFlowModal
        isOpen={isAddAnotherOpen}
        choices={choices}
        storeConfig={storeConfig}
        onClose={() => setIsAddAnotherOpen(false)}
        onAddAnotherPotato={handleAddAnotherPotato}
        onContinueToToppings={handleContinueToToppings}
      />

      <OrderConfirmModal
        isOpen={isConfirmOpen && choices.length > 0}
        onClose={() => setIsConfirmOpen(false)}
        items={choices}
        mode={mode}
        onChangeMode={setMode}
        storeConfig={storeConfig}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        storeConfig={storeConfig}
        onSave={handleSaveStoreConfig}
      />

      <RecentOrderNotifications orders={recentOrders} />
    </div>
  );
}
