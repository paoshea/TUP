import * as React from 'react';
import { cn } from '../../lib/utils';

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number;
  error?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, icon, onFileSelect, accept, maxSize, error, ...props }, ref) => {
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
          setDragActive(true);
        } else if (e.type === 'dragleave') {
          setDragActive(false);
        }
      },
      []
    );

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (maxSize && file.size > maxSize) {
            return;
          }
          onFileSelect?.(file);
        }
      },
      [maxSize, onFileSelect]
    );

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (maxSize && file.size > maxSize) {
            return;
          }
          onFileSelect?.(file);
        }
      },
      [maxSize, onFileSelect]
    );

    const handleClick = () => {
      inputRef.current?.click();
    };

    return (
      <div className="relative">
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-4 text-center transition-colors hover:bg-accent/50',
            dragActive && 'border-primary bg-accent/50',
            error && 'border-destructive',
            className
          )}
        >
          {icon}
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Click to upload</span>{' '}
            or drag and drop
            {accept && (
              <p className="text-xs">
                Allowed types: {accept.split(',').join(', ')}
              </p>
            )}
            {maxSize && (
              <p className="text-xs">
                Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            )}
          </div>
        </div>
        <input
          type="file"
          ref={(e) => {
            inputRef.current = e;
            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              ref.current = e;
            }
          }}
          accept={accept}
          className="hidden"
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
FileInput.displayName = 'FileInput';

export { FileInput };