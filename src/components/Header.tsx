import { useEffect, useState } from 'react';

const WEEKDAYS_PT = [
  'DOMINGO',
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
  'SÁBADO',
] as const;

const MONTHS_PT = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO',
] as const;

function formatPromoDate(date: Date): string {
  const weekday = WEEKDAYS_PT[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_PT[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday} ${day}/${month}/${year}`;
}

export function Header() {
  const [promoDateLabel, setPromoDateLabel] = useState<string>(() =>
    formatPromoDate(new Date())
  );

  useEffect(() => {
    let midnightTimer: number | undefined;

    const refreshDateAndScheduleNext = () => {
      const now = new Date();
      setPromoDateLabel(formatPromoDate(now));

      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1
      );
      const msUntilMidnight = Math.max(
        1000,
        nextMidnight.getTime() - now.getTime()
      );

      if (midnightTimer !== undefined) {
        window.clearTimeout(midnightTimer);
      }
      midnightTimer = window.setTimeout(
        refreshDateAndScheduleNext,
        msUntilMidnight
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshDateAndScheduleNext();
      }
    };

    refreshDateAndScheduleNext();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refreshDateAndScheduleNext);

    return () => {
      if (midnightTimer !== undefined) {
        window.clearTimeout(midnightTimer);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refreshDateAndScheduleNext);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40">
      <div
        role="region"
        aria-label="Promoção do dia"
        className="w-full bg-[#DC2626] text-white px-3 py-2 text-center border-b border-[#B91C1C]"
      >
        <p className="max-w-7xl mx-auto text-[11px] sm:text-xs font-bold tracking-wide leading-snug animate-promo-blink">
          🔥 PROMOÇÃO VÁLIDA HOJE {promoDateLabel} – 10% DE DESCONTO! PARA A PRIMEIRA COMPRA
        </p>
      </div>

      <header className="bg-[#F8F7F4]/95 backdrop-blur-sm border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a
            href="#inicio"
            className="inline-flex items-baseline gap-1.5 font-display text-lg sm:text-xl font-bold tracking-tight leading-none whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B45309]"
          >
            <span className="text-[#171614]">+BAHTATA</span>
            <span className="text-[#B45309]">RECHEADA</span>
          </a>
        </div>
      </header>
    </div>
  );
}
