'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ParkingCircle, User, Shield, Wrench, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ParkingCircle className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            ParkWatch
          </span>
        </Link>
        <nav className="flex items-center space-x-2 flex-1">
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
          {user && (
             <>
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
            </>
          )}
        </nav>
        <div className="flex items-center">
          {user ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
