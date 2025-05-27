import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onHeightChange?: (height: number) => void;
  showCharCount?: boolean;
  maxLength?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-gray-300 dark:focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, onHeightChange, showCharCount = false, maxLength = 2000, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = React.useState(0);

    React.useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 200); // Min 40px, Max 200px
        textarea.style.height = `${newHeight}px`;
        onHeightChange?.(newHeight);
        setCharCount(textarea.value.length);
      }
    }, [props.value, onHeightChange]);

    return (
      <div className="relative w-full">
        <div className="relative rounded-xl bg-white dark:bg-gray-950 shadow-sm">
          <textarea
            className={cn(
              "block w-full text-base px-4 py-3 pb-8 bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-300 dark:focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden transition-colors duration-200",
              className,
            )}
            ref={(element) => {
              textareaRef.current = element;
              if (typeof ref === 'function') {
                ref(element);
              } else if (ref) {
                ref.current = element;
              }
            }}
            rows={1}
            maxLength={maxLength}
            {...props}
          />
          {showCharCount && (
            <div className="absolute bottom-2 left-4 text-xs font-medium text-gray-400 dark:text-gray-500 select-none">
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

export { Input, TextArea };
