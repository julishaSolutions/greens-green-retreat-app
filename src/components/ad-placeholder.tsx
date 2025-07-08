import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

export function AdPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[100px] w-full bg-muted/50 border border-dashed rounded-lg text-center p-4 my-8',
        className
      )}
    >
      <Megaphone className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground font-sans tracking-widest uppercase">Advertisement</p>
    </div>
  );
}
