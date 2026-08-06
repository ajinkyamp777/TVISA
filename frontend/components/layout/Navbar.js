'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import { cartAPI, productsAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navbar() {
    const { data: session } = useSession();
    const { isCartOpen, toggleCart } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: cartData } = useQuery({
        queryKey: QUERY_KEYS.cart,
        queryFn: async () => {
            const res = await cartAPI.getCart();
            return res.data?.data || res.data;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
        retry: false,
    });

    const { data: categoriesData } = useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: async () => {
            const res = await productsAPI.getCategories();
            return res.data?.data || res.data;
        },
        staleTime: 60 * 1000,
    });

    const cartCount = cartData?.total_items || 0;

    const categories = categoriesData?.results || categoriesData || [];
    const categoryLinks = categories.slice(0, 4).map((cat) => ({
        label: cat.name,
        href: `/categories/${cat.slug}`,
    }));
    const navLinks = [
        { label: 'Collections', href: '/categories' },
        ...categoryLinks,
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-[#F9F6F0]/80 backdrop-blur-xl border-b border-[#31271D]/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-24">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-[#31271D] hover:text-[#A9957F] transition-colors"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image
                                src="/images/logo.png"
                                alt="Tvisaa"
                                width={200}
                                height={60}
                                className="h-12 lg:h-16 w-auto object-contain brightness-0"
                                priority={true}
                            />
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center space-x-10">
                            <Link href={'/'} className="text-sm font-jost font-medium uppercase tracking-widest text-[#31271D] hover:text-[#A9957F] transition-colors relative group">
                                Home
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#A9957F] transition-all duration-300 group-hover:w-full" />
                            </Link>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-jost font-medium uppercase tracking-widest text-[#31271D] hover:text-[#A9957F] transition-colors relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#A9957F] transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center space-x-5">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="text-[#31271D] hover:text-[#A9957F] transition-colors"
                                aria-label="Search"
                            >
                                <FiSearch size={20} />
                            </button>

                            <Link
                                href="/wishlist"
                                className="text-[#31271D] hover:text-[#A9957F] transition-colors hidden sm:block"
                                aria-label="Wishlist"
                            >
                                <FiHeart size={20} />
                            </Link>

                            <button
                                onClick={toggleCart}
                                className="text-[#31271D] hover:text-[#A9957F] transition-colors relative"
                                aria-label="Cart"
                            >
                                <FiShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-[#A9957F] text-white text-[10px] font-medium rounded-full w-[18px] h-[18px] flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {session ? (
                                <div className="relative group">
                                    <Link href="/account" className="text-[#31271D] hover:text-[#A9957F] transition-colors">
                                        <FiUser size={20} />
                                    </Link>
                                    <div className="absolute right-0 top-full mt-4 w-48 bg-[#F9F6F0] border border-[#31271D]/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                        <div className="p-4 border-b border-[#31271D]/10">
                                            <p className="text-sm font-medium font-jost text-[#31271D] truncate">{session.user.name}</p>
                                            <p className="text-xs text-[#8C7C66] font-jost truncate">{session.user.email}</p>
                                        </div>
                                        <Link href="/account" className="block px-4 py-3 text-sm font-jost text-[#31271D] hover:bg-[#EAE4D9] transition-colors">
                                            My Account
                                        </Link>
                                        <Link href="/account/orders" className="block px-4 py-3 text-sm font-jost text-[#31271D] hover:bg-[#EAE4D9] transition-colors">
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="w-full text-left px-4 py-3 text-sm font-jost text-[#31271D] hover:bg-[#EAE4D9] transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="hidden sm:inline-flex items-center text-[13px] font-jost font-medium tracking-widest uppercase text-[#31271D] hover:text-[#A9957F] transition-colors"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <div className="border-t border-[#31271D]/10 bg-[#F9F6F0] animate-fade-in shadow-inner">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                            <form onSubmit={handleSearch} className="flex items-center gap-4">
                                <FiSearch className="text-[#8C7C66]" size={22} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search collections..."
                                    className="flex-1 bg-transparent text-[#31271D] placeholder:text-[#8C7C66] outline-none font-jost text-lg"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-[#8C7C66] hover:text-[#31271D] transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-[#31271D]/10 bg-[#F9F6F0] animate-fade-in shadow-lg absolute w-full left-0">
                        <nav className="px-6 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 text-sm font-jost font-medium tracking-widest uppercase text-[#31271D] hover:text-[#A9957F] transition-colors border-b border-[#31271D]/10"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!session && (
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-4 text-sm font-jost font-medium tracking-widest uppercase text-[#A9957F]"
                                >
                                    Log In
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <CartDrawer isOpen={isCartOpen} />
        </>
    );
}
