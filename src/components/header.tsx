'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ParkingCircle, User, Shield, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ParkingCircle className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            ParkWatch
          </span>
        </Link>
        <nav className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className={cn(
              'transition-colors',
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            )}
            asChild
          >
            <Link href="/">
              <User className="mr-2 h-4 w-4" />
              Find Parking
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'transition-colors',
              pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'
            )}
            asChild
          >
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'transition-colors',
               pathname?.startsWith('/management') ? 'text-primary' : 'text-muted-foreground'
            )}
            asChild
          >
            <Link href="/management">
              <Wrench className="mr-2 h-4 w-4" />
              Management
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
