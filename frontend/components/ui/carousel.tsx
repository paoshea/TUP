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

    React.useEffect(() => {
      if (emblaApi) {
        setApi?.(emblaApi);
      }
    }, [emblaApi, setApi]);

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

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        <div
          ref={emblaRef}
          className="overflow-hidden"
          dir="ltr"
        >
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
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full',
              orientation === 'horizontal'
                ? 'left-12 -translate-x-1/2'
                : 'left-1/2 -translate-x-1/2 rotate-90'
            )}
            disabled={prevBtnDisabled}
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full',
              orientation === 'horizontal'
                ? 'right-12 translate-x-1/2'
                : 'right-1/2 translate-x-1/2 rotate-90'
            )}
            disabled={nextBtnDisabled}
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn('absolute left-4 top-1/2 -translate-y-1/2', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </Button>
));
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn('absolute right-4 top-1/2 -translate-y-1/2', className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </Button>
));
CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};