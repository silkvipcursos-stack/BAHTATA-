import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin } from 'lucide-react';
import type { AuthorizedRecentOrder } from '../types';

export const CAXIAS_DO_SUL_RECENT_ORDERS: AuthorizedRecentOrder[] = [
  {
    id: 'cxs-1',
    firstName: 'Fernanda',
    neighborhood: 'Centro',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-2',
    firstName: 'Lucas',
    neighborhood: 'Exposição',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-3',
    firstName: 'Mariana',
    neighborhood: 'São Pelegrino',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-4',
    firstName: 'Rafael',
    neighborhood: 'Cruzeiro',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-5',
    firstName: 'Camila',
    neighborhood: 'Desvio Rizzo',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-6',
    firstName: 'Thiago',
    neighborhood: 'Santa Catarina',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-7',
    firstName: 'Juliana',
    neighborhood: 'Lourdes',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-8',
    firstName: 'Bruno',
    neighborhood: 'Pio X',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-9',
    firstName: 'Patrícia',
    neighborhood: 'Panazzolo',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-10',
    firstName: 'Gabriel',
    neighborhood: 'Cinquentenário',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-11',
    firstName: 'Larissa',
    neighborhood: 'Madureira',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-12',
    firstName: 'Matheus',
    neighborhood: 'Rio Branco',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-13',
    firstName: 'Beatriz',
    neighborhood: 'Kayser',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-14',
    firstName: 'Rodrigo',
    neighborhood: 'Bela Vista',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-15',
    firstName: 'Amanda',
    neighborhood: 'Fátima',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
  {
    id: 'cxs-16',
    firstName: 'Felipe',
    neighborhood: 'Universitário',
    createdAt: 'Agora há pouco',
    authorized: true,
  },
];

interface RecentOrderNotificationsProps {
  orders: AuthorizedRecentOrder[];
}

const NOTIFICATION_INTERVAL_MS = 13000;
const NOTIFICATION_VISIBLE_MS = 5000;
const EXIT_ANIMATION_MS = 300;

export function RecentOrderNotifications({
  orders,
}: RecentOrderNotificationsProps) {
  const uniqueOrders = useMemo(() => {
    const seenNames = new Set<string>();
    return orders.filter((order) => {
      const normalized = order.firstName.trim().toLowerCase();
      if (!normalized || seenNames.has(normalized)) return false;
      seenNames.add(normalized);
      return true;
    });
  }, [orders]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (uniqueOrders.length === 0) {
      setIsRendered(false);
      setIsVisible(false);
      return;
    }

    let nextTimer: number | undefined;
    let hideTimer: number | undefined;
    let unmountTimer: number | undefined;
    let enterRaf: number | undefined;
    let currentIdx = 0;

    const triggerNotification = (index: number) => {
      if (index >= uniqueOrders.length) {
        return;
      }

      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer);
      if (enterRaf !== undefined) window.cancelAnimationFrame(enterRaf);

      setActiveIndex(index);
      setIsRendered(true);

      enterRaf = window.requestAnimationFrame(() => {
        enterRaf = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      hideTimer = window.setTimeout(() => {
        setIsVisible(false);
        unmountTimer = window.setTimeout(() => {
          setIsRendered(false);
        }, EXIT_ANIMATION_MS);
      }, NOTIFICATION_VISIBLE_MS);

      const nextIdx = index + 1;
      if (nextIdx < uniqueOrders.length) {
        nextTimer = window.setTimeout(() => {
          currentIdx = nextIdx;
          triggerNotification(currentIdx);
        }, NOTIFICATION_INTERVAL_MS);
      }
    };

    triggerNotification(0);

    return () => {
      if (nextTimer !== undefined) window.clearTimeout(nextTimer);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer);
      if (enterRaf !== undefined) window.cancelAnimationFrame(enterRaf);
    };
  }, [uniqueOrders]);

  if (
    uniqueOrders.length === 0 ||
    !isRendered ||
    typeof document === 'undefined'
  ) {
    return null;
  }

  const currentOrder = uniqueOrders[activeIndex];
  if (!currentOrder) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="fixed top-[62px] sm:top-[48px] right-2.5 sm:right-5 z-50 pointer-events-none max-w-[min(300px,calc(100vw-1.25rem))] sm:max-w-[360px]"
    >
      <div
        className={`pointer-events-auto rounded-xl bg-white/95 backdrop-blur-sm border border-[#E5E2DC] shadow-lg px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 transition-all duration-300 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FEF7EE] border border-[#FDE6C4] flex items-center justify-center text-[#B45309] shrink-0">
          <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-xs sm:text-[13px] font-bold text-[#171614] leading-snug uppercase">
            {currentOrder.firstName} ACABOU DE PEDIR UMA BATATA RECHEADA!
          </p>
          <p className="text-[11px] sm:text-xs font-medium text-[#57534E] mt-0.5 truncate">
            Caxias do Sul/RS · Bairro {currentOrder.neighborhood}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
