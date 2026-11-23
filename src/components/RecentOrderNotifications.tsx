import { useEffect, useState } from 'react';
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
];

interface RecentOrderNotificationsProps {
  orders: AuthorizedRecentOrder[];
  hasMobileBottomBar?: boolean;
}

const INITIAL_DELAY_MS = 1000;
const NOTIFICATION_INTERVAL_MS = 13000;
const NOTIFICATION_VISIBLE_MS = 5500;
const EXIT_ANIMATION_MS = 300;

export function RecentOrderNotifications({
  orders,
  hasMobileBottomBar = false,
}: RecentOrderNotificationsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (orders.length === 0) {
      setIsRendered(false);
      setIsVisible(false);
      return;
    }

    let initialTimer: number | undefined;
    let intervalId: number | undefined;
    let hideTimer: number | undefined;
    let unmountTimer: number | undefined;
    let enterRaf: number | undefined;

    const showCurrentNotification = () => {
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer);
      if (enterRaf !== undefined) window.cancelAnimationFrame(enterRaf);

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
          setActiveIndex((prev) => (prev + 1) % orders.length);
        }, EXIT_ANIMATION_MS);
      }, NOTIFICATION_VISIBLE_MS);
    };

    initialTimer = window.setTimeout(() => {
      showCurrentNotification();
      intervalId = window.setInterval(
        showCurrentNotification,
        NOTIFICATION_INTERVAL_MS
      );
    }, INITIAL_DELAY_MS);

    return () => {
      if (initialTimer !== undefined) window.clearTimeout(initialTimer);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer);
      if (enterRaf !== undefined) window.cancelAnimationFrame(enterRaf);
    };
  }, [orders]);

  if (orders.length === 0 || !isRendered) {
    return null;
  }

  const currentOrder = orders[activeIndex % orders.length];
  if (!currentOrder) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed left-3 right-3 sm:right-auto sm:left-5 ${
        hasMobileBottomBar ? 'bottom-20 md:bottom-5' : 'bottom-4 md:bottom-5'
      } z-30 pointer-events-none flex justify-center sm:justify-start`}
    >
      <div
        className={`pointer-events-auto w-full max-w-xs sm:max-w-sm rounded-xl bg-white/95 backdrop-blur-sm border border-[#E5E2DC] shadow-lg px-3.5 py-2.5 flex items-start gap-2.5 transition-all duration-300 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3'
        }`}
      >
        <span className="w-8 h-8 rounded-lg bg-[#FEF7EE] border border-[#FDE6C4] flex items-center justify-center text-[#B45309] shrink-0 mt-0.5">
          <MapPin className="w-4 h-4" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-bold text-[#171614] leading-snug uppercase">
            “{currentOrder.firstName} ACABOU DE PEDIR UMA BATATA RECHEADA!”
          </p>
          <p className="text-[11px] font-medium text-[#57534E] mt-0.5">
            Bairro: {currentOrder.neighborhood} – Caxias do Sul/RS.
          </p>
        </div>
      </div>
    </div>
  );
}
