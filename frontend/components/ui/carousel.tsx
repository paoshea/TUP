import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} | null;

const CarouselContext = React.createContext<CarouselContextProps>(null);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
};

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins
    );

    const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

    const scrollPrev = React.useCallback(
      () => emblaApi && emblaApi.scrollPrev(),
      [emblaApi]
    );
    const scrollNext = React.useCallback(
      () => emblaApi && emblaApi.scrollNext(),
      [emblaApi]
    );

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;

      setPrevBtnDisabled(!api.canScrollPrev());
      setNextBtnDisabled(!api.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!emblaApi) return;

      onSelect(emblaApi);
      emblaApi.on('select', () => onSelect(emblaApi));
      emblaApi.on('reInit', () => onSelect(emblaApi));
    }, [emblaApi, onSelect]);

    React.useEffect(() => {
      if (emblaApi) setApi?.(emblaApi);
    }, [emblaApi, setApi]);

    const context = React.useMemo(
      () => ({
        carouselRef: emblaRef,
        api: emblaApi,
        scrollPrev,
        scrollNext,
        canScrollPrev: !prevBtnDisabled,
        canScrollNext: !nextBtnDisabled,
      }),
      [emblaApi, emblaRef, nextBtnDisabled, prevBtnDisabled, scrollNext, scrollPrev]
    );

    return (
      <CarouselContext.Provider value={context}>
        <div ref={ref} className={cn('relative', className)} {...props}>
          <div ref={emblaRef} className="overflow-hidden" dir="ltr">
            <div
              className={cn(
                'flex',
                orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
                className
              )}
            >
              {React.Children.map(children, (child) => (
                <div
                  className={cn(
                    'min-w-0 flex-[0_0_100%]',
                    orientation === 'horizontal' ? 'pl-4' : 'pt-4'
                  )}
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('h-8 w-8 rounded-full', className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('h-8 w-8 rounded-full', className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

export { type CarouselApi, Carousel, CarouselPrevious, CarouselNext };