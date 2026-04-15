'use client';

import { memo, useEffect, useRef, useState } from "react";
import { Moon, Sun, Search, ShoppingCart, User, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useGetCartQuery } from "@/Redux/Services/CartApi";
import {  useLazySearchProductsQuery } from "@/Redux/Services/ProductsApi";
import { useLogoutMutation } from "@/Redux/Services/AuthApi";
import { useGetAllClassificationsQuery } from "@/Redux/Services/ClassificationApi";
import { useAppSelector, useAppDispatch } from "@/Redux/hooks";
import { logout as logoutAction } from "@/Redux/slices/AuthSlice";
import toast from "react-hot-toast";
import { Product } from "@/lib/DatabaseTypes";
import { useI18n } from "@/context/I18nContext";

interface ListItemProps {
  id: string;
  name: string;
  children: React.ReactNode;
}

function ListItem({ id, name, children }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild className="">
        <Link
          href={`/products?classification=${id}`}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">
            {name}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const Navbar = memo(function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { messages, t } = useI18n();

  const { data: categoriesData } = useGetAllClassificationsQuery();
   const categories = categoriesData?.content || [];

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMutation] = useLogoutMutation();
  const { data: cartData } = useGetCartQuery();
  const [triggerSearch] = useLazySearchProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRequestRef = useRef(0);
  
  const totalItems = cartData?.totalItems || 0;
  
  
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };


  useEffect(() => {
    const normalized = searchTerm.trim();

    if (normalized.length < 2) {
      return;
    }

    const requestId = ++searchRequestRef.current;
    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await triggerSearch({ query: normalized }).unwrap();
        if (requestId !== searchRequestRef.current) {
          return;
        }

        setSearchResults(result?.content || []);
      } catch {
        if (requestId !== searchRequestRef.current) {
          return;
        }

        setSearchResults([]);
        toast.error("Search failed");
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm, triggerSearch]);

  useEffect(() => {
    const sharedRoutes = ["/jobs", "/products", "/cart", "/about", "/help"];

    sharedRoutes.forEach((route) => {
      router.prefetch(route);
    });

    if (user) {
      router.prefetch("/my-account");
      return;
    }

    router.prefetch("/login");
    router.prefetch("/register");
  }, [router, user]);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm border-b border-border" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" aria-label="Go to homepage">
            <h2 className="text-xl font-bold">Ch <span className="text-primary">Jobs</span></h2>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:block w-full max-w-md relative">
          <label htmlFor="product-search" className="sr-only">{messages.navbar.searchLabel}</label>
          <input
            id="product-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={messages.navbar.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" aria-hidden="true" />

          {/* Search Dropdown */}
          {searchTerm.trim().length >= 2 && (
            <div 
              id="search-results"
              className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border border-border rounded-md shadow-md z-50 max-h-96 overflow-y-auto"
              role="listbox"
              aria-label={messages.navbar.searchResultsLabel}
            >
              {searchResults.length > 0 ? (
                searchResults.map((product : Product) => (
                  <Link
                    key={product.id}
                    href={`/productdetails/${product.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      setSearchTerm("");
                    }}
                    role="option"
                  >
                    <Image
                      src={product.mainImage}
                      alt=""
                      className="w-10 h-10 object-contain"
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground" role="status">
                  {messages.navbar.noProductsFound}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <div className="flex">
              <NavigationMenu className="">
                <NavigationMenuList className="">
                  <Link href="/about" className="mx-2">
                    <span className="font-semibold text-sm cursor-pointer capitalize hover:text-primary transition-colors">
                      {messages.navbar.aboutUs}
                    </span>
                  </Link>
                  <Link href="/help" className="mx-2">
                    <span className="font-semibold text-sm cursor-pointer capitalize hover:text-primary transition-colors">
                      {messages.navbar.helpCenter}
                    </span>
                  </Link>
                  <NavigationMenuItem className="">
                    <NavigationMenuTrigger className=" text-sm px-3 mx-2 cursor-pointer bg-transparent hover:text-purple-700 dark:hover:text-purple-300">
                      {messages.navbar.categories}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="">
                      <ul className="grid md:w-100 md:grid-cols-2 gap-3 p-4">
                        {categories.map((category) => (
                          <ListItem
                            id={category.id}
                            key={category.name}
                            name={category.name}
                          >
                            {category.desc}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="text-base border-none cursor-pointer"
                      variant="outline"
                      size="default"
                      aria-label={messages.navbar.userMenu}
                    >
                      <User className="text-sm" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white dark:bg-zinc-900 shadow-lg border border-border rounded-md"
                  >
                    <Link href="/my-account">
                      <DropdownMenuItem className="cursor-pointer" inset={false}>
                        {messages.navbar.myAccount}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="cursor-pointer hover:text-red-400 transition duration-300"
                      onClick={handleLogout}
                      inset={false}
                    >
                      {messages.navbar.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="text-base border-none cursor-pointer"
                      variant="outline"
                      size="default"
                      aria-label={messages.navbar.accountOptions}
                    >
                      {messages.navbar.myAccount}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white dark:bg-zinc-900 shadow-lg border border-border rounded-md"
                  >
                    <Link href="/login">
                      <DropdownMenuItem className="cursor-pointer" inset={false}>
                        {messages.navbar.login}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/register">
                      <DropdownMenuItem className="cursor-pointer" inset={false}>
                        {messages.navbar.register}
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {/* Icons */}
          <Link href="/cart" className="relative" aria-label={t(messages.navbar.cartLabel, { count: totalItems })}>
            <Button variant="ghost" size="icon" className="">
              <ShoppingCart className="text-xl" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" aria-label={t(messages.navbar.cartItemsLabel, { count: totalItems })}>
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
                <span className="sr-only">{messages.navbar.toggleTheme}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-zinc-900 shadow-lg border border-border rounded-md"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme("light")}
                inset={false}
              >
                {messages.navbar.light}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme("dark")}
                inset={false}
              >
                {messages.navbar.dark}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme("system")}
                inset={false}
              >
                {messages.navbar.system}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu For Mobile */}
          <Button
            variant="ghost"
            size="default"
            className="block md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={messages.navbar.mobileMenuLabel}
            aria-expanded={isOpen}
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-6 py-3 pb-4 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200 shadow-sm border-t border-border">
          <div className="flex flex-col gap-1">
            <div className="px-3 py-1 text-sm font-semibold text-muted-foreground">
              {messages.navbar.categories}
            </div>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="default"
                className="justify-start px-3 w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                <Link href={`/products?classification=${category.id}`} className="flex flex-col w-full">
                  <span className="text-base font-medium text-zinc-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.desc ?? ''}
                  </span>
                </Link>
              </Button>
            ))}
          </div>

          <hr className="my-2" />

          <div className="flex flex-col gap-1">
            <div className="px-3 py-1 text-sm font-semibold text-muted-foreground">
              {messages.navbar.myAccount}
            </div>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="default"
                  className="justify-start px-3 w-full text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/my-account" className="flex flex-col w-full">
                    <span className="text-base font-medium text-zinc-900 dark:text-white">
                      {messages.navbar.myAccount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {messages.navbar.mobileAccountHint}
                    </span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  className="justify-start px-3 w-full text-left"
                  onClick={handleLogout}
                >
                  <span className="text-base font-medium text-zinc-900 dark:text-white">
                    {messages.navbar.logout}
                  </span>
                </Button>
                <Link href="/about" className="px-3 py-2">
                  <span className="font-semibold cursor-pointer capitalize hover:text-primary transition-colors">
                    {messages.navbar.aboutUs}
                  </span>
                </Link>
                <Link href="/help" className="px-3 py-2">
                  <span className="font-semibold cursor-pointer capitalize hover:text-primary transition-colors">
                    {messages.navbar.helpCenter}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="default"
                  className="justify-start px-3 w-full text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/login" className="flex flex-col w-full">
                    <span className="text-base font-medium text-zinc-900 dark:text-white">
                      {messages.navbar.login}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {messages.navbar.mobileAccountHint}
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="default"
                  className="justify-start px-3 w-full text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/register" className="flex flex-col w-full">
                    <span className="text-base font-medium text-zinc-900 dark:text-white">
                      {messages.navbar.register}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {messages.navbar.mobileCreateAccountHint}
                    </span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
