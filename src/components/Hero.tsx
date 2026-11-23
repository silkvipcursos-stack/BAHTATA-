import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/menu';
import { ConfettiBurst, type BurstOrigin } from './ConfettiBurst';
import { SafeImage } from './SafeImage';

interface YTPlayerInstance {
  unloadModule?: (moduleName: string) => void;
  setOption?: (
    moduleName: string,
    option: string,
    value: Record<string, unknown>
  ) => void;
}

interface YTGlobal {
  Player: new (
    element: HTMLElement | string,
    options: {
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onApiChange?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: { target: YTPlayerInstance; data: number }) => void;
      };
    }
  ) => YTPlayerInstance;
}

declare global {
  interface Window {
    YT?: YTGlobal;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface HeroProps {
  onStartCustomizing: () => void;
}

export function Hero({ onStartCustomizing }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [burst, setBurst] = useState<BurstOrigin | null>(null);
  const vslIframeRef = useRef<HTMLIFrameElement | null>(null);

  const vslEmbedUrl = useMemo(() => {
    const params = new URLSearchParams({
      enablejsapi: '1',
      cc_load_policy: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });
    if (typeof window !== 'undefined' && window.location.origin) {
      params.set('origin', window.location.origin);
    }
    return `https://www.youtube.com/embed/AHk1nEcVTRY?${params.toString()}`;
  }, []);

  useEffect(() => {
    let isMounted = true;
    let playerAttached = false;

    const disableCaptions = (player: YTPlayerInstance | undefined) => {
      if (!player) return;
      try {
        player.unloadModule?.('captions');
        player.unloadModule?.('cc');
        player.setOption?.('captions', 'track', {});
        player.setOption?.('cc', 'track', {});
      } catch {
        // Ignore if captions module is not active yet
      }
    };

    const attachPlayer = () => {
      if (!isMounted || playerAttached || !vslIframeRef.current || !window.YT?.Player) {
        return;
      }
      playerAttached = true;

      new window.YT.Player(vslIframeRef.current, {
        events: {
          onReady: (event) => {
            disableCaptions(event.target);
          },
          onApiChange: (event) => {
            disableCaptions(event.target);
          },
          onStateChange: (event) => {
            disableCaptions(event.target);
          },
        },
      });
    };

    if (window.YT?.Player) {
      attachPlayer();
    } else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        attachPlayer();
      };

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="inicio" className="border-b border-[#E5E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-[76px] lg:pt-20 lg:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-none mb-4">
            <span className="text-[#171614]">+BAHTATA</span>{' '}
            <span className="text-[#B45309]">RECHEADA</span>
          </p>

          <h1
            className="font-display font-bold tracking-tight leading-[1.06] max-w-3xl mx-auto"
            style={{
              fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)',
              textWrap: 'balance',
            }}
          >
            <span className="text-[#171614]">
              Atenção Seu próximo prato favorito{' '}
            </span>
            <span className="text-[#B45309]">
              está a poucos minutos de distância!
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mx-auto">
            As melhores da cidade: recheio supercremoso e uma explosão de delícias a cada mordida!
          </p>

          <div className="mt-7 rounded-xl bg-[#171614] p-2.5 sm:p-3 border border-[#292524] max-w-2xl mx-auto">
            <div className="w-full h-[420px] sm:h-[520px] rounded-lg overflow-hidden bg-black">
              <iframe
                ref={vslIframeRef}
                id="hero-vsl-player"
                src={vslEmbedUrl}
                title="Vídeo VSL Batata Recheada Artesanal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>

          <div className="mt-6 max-w-xl mx-auto">
            <p className="text-xs font-semibold text-[#B45309] inline-flex items-center justify-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Assista antes de pedir</span>
            </p>
            <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold leading-snug text-[#171614]">
              Veja o recheio supercremoso por dentro
            </h2>
            <div className="mt-5">
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setBurst({
                    id: Date.now(),
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
                  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    onStartCustomizing();
                  } else {
                    window.setTimeout(() => {
                      onStartCustomizing();
                    }, 240);
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#B45309] text-white text-sm font-semibold hover:bg-[#92400E] active:scale-[0.99] transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B45309]"
              >
                <span>Personalizar Minha Batata</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#E5E2DC] grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-[#78716C]">Cardápio Focado</p>
            <p className="mt-1 text-sm font-semibold text-[#171614]">
              4 Sabores · Catupiry ou Cheddar
            </p>
          </div>
          <div>
            <p className="text-xs text-[#78716C]">Personalização</p>
            <p className="mt-1 text-sm font-semibold text-[#171614]">
              Ingredientes & Opções exclusivas
            </p>
          </div>
          <div>
            <p className="text-xs text-[#78716C]">Agendamento Flexível</p>
            <p className="mt-1 text-sm font-semibold text-[#171614]">
              Entrega ou retirada com hora marcada
            </p>
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Galeria de batatas recheadas"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="mt-10 max-w-sm mx-auto"
        >
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#ECEAE4] border border-[#E5E2DC]">
            <div
              className="flex h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {GALLERY_IMAGES.map((img) => (
                <a
                  key={img.id}
                  href={img.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full shrink-0 block"
                >
                  <SafeImage
                    src={img.src}
                    alt={img.alt}
                    fallbackLabel="Batata Recheada Artesanal"
                    className="w-full h-full object-cover object-center"
                  />
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
                )
              }
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % GALLERY_IMAGES.length)
              }
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>

            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/65 font-mono text-xs text-white tabular-nums">
              {activeIndex + 1} / {GALLERY_IMAGES.length}
            </span>
          </div>

          <div
            className="mt-3 grid grid-cols-5 gap-2"
            role="tablist"
            aria-label="Selecionar imagem do carrossel"
          >
            {GALLERY_IMAGES.map((img, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={img.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Ver imagem ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-[#B45309] border-[#B45309] opacity-100'
                      : 'border-[#E5E2DC] opacity-65 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ConfettiBurst burst={burst} />
    </section>
  );
}
