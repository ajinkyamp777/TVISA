'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ShoppingBag, Heart, ShieldCheck, Award, Lock, Search } from 'lucide-react';
import { FiTruck } from 'react-icons/fi';
import { cartAPI, wishlistAPI, extractErrorMessage } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import { useCart } from '@/providers/CartProvider';
import { getImageUrl } from '@/lib/images';
import toast from 'react-hot-toast';

export default function ProductDetailClient({ product }) {
    const { data: session } = useSession();
    const { openCart } = useCart();
    const queryClient = useQueryClient();

    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    const { data: liveProduct } = useQuery({
        queryKey: ['product-live', product?.id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}/`, {
                cache: 'no-store',
            });
            const data = await res.json();
            return data?.data || data;
        },
        enabled: !!product?.id,
        staleTime: 0,
    });

    const activeProduct = liveProduct || product;

    useEffect(() => {
        if (activeProduct?.variants?.length > 0 && !selectedVariantId) {
            setSelectedVariantId(activeProduct.variants[0].id);
        }
    }, [activeProduct, selectedVariantId]);

    const variants = activeProduct?.variants || [];
    const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

    const addToCartMutation = useMutation({
        mutationFn: () => cartAPI.addItem({
            variant_id: selectedVariant.id,
            quantity: 1,
            product_name: activeProduct.name,
            primary_image: getImageUrl(activeProduct.images?.[0]),
            variant_detail: { metal_type: selectedVariant?.metal_type, size: selectedVariant?.size },
            price: Number(
                (!!activeProduct.discounted_price && Number(activeProduct.discounted_price) > 0)
                    ? activeProduct.discounted_price
                    : activeProduct.base_price
            ),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
            toast.success('Added to cart');
            openCart();
        },
        onError: (err) => toast.error(extractErrorMessage(err, 'Failed to add to cart')),
    });

    const addToWishlistMutation = useMutation({
        mutationFn: () => wishlistAPI.addToWishlist(product.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
            toast.success('Added to wishlist');
        },
        onError: (err) => toast.error(extractErrorMessage(err, 'Already in wishlist')),
    });

    if (!activeProduct) return null;

    const images = activeProduct.images || [];
    const coatingsMap = new Map();

    variants.forEach((v) => {
        if (v.coating && !coatingsMap.has(v.coating.name)) {
            coatingsMap.set(v.coating.name, v.coating);
        } else if (!v.coating && v.metal_type && !coatingsMap.has(v.metal_type)) {
            coatingsMap.set(v.metal_type, { name: v.metal_type, color_rgb: 'transparent' });
        }
    });

    const coatings = Array.from(coatingsMap.values());
    const currentPrice = activeProduct.base_price;
    const currentStock = selectedVariant?.stock || 0;
    const isDiscounted = !!activeProduct.discounted_price && Number(activeProduct.discounted_price) > 0;

    const formatInr = (value) => `\u20B9${Number(value || 0).toLocaleString('en-IN')}`;

    const descriptionItems = [
        {
            title: 'Material',
            text: 'Premium 304/316 Stainless Steel.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                    <path d="m9.5 12.5 1.8 1.8 3.2-3.4" />
                </svg>
            ),
        },
        {
            title: 'Plating',
            text: 'Gold PVD Coating (Color guaranteed for 1 year+).',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="m12 3 9 4.5-9 4.5-9-4.5 9-4.5z" />
                    <path d="m3 12 9 4.5 9-4.5" />
                    <path d="m3 16.5 9 4.5 9-4.5" />
                </svg>
            ),
        },
        {
            title: 'Durability',
            text: '100% Waterproof and Anti-Tarnish.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2C9 6.2 6 9.6 6 13a6 6 0 0 0 12 0c0-3.4-3-6.8-6-11z" />
                </svg>
            ),
        },
        {
            title: 'Skin-friendly',
            text: 'Hypoallergenic and safe for sensitive skin.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 13c2-6 8-9 16-9-1 8-4 14-10 16-2 .6-4 0-5.2-1.8C3.8 16.6 3.5 14.8 4 13z" />
                    <path d="M8 20c1.2-2.4 2.8-4.2 5-5.8" />
                </svg>
            ),
        },
    ];

    const productHighlights = [
        {
            label: 'Water-resistant',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3c-2.5 3.5-5 6.3-5 9a5 5 0 0 0 10 0c0-2.7-2.5-5.5-5-9z" />
                </svg>
            ),
        },
        {
            label: 'Tarnish-resistant',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                    <path d="m9.5 12.5 1.8 1.8 3.2-3.4" />
                </svg>
            ),
        },
        {
            label: 'Everyday wear',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15" />
                </svg>
            ),
        },
    ];

    const infoCardItems = [
        {
            title: 'Fast Shipping',
            text: 'Your order will be dispatched within 24-48 hours.',
            icon: <FiTruck size={18} className="text-[#B66D55]" />,
        },
        {
            title: 'Water Resistant',
            text: 'Made to last. Suitable for everyday wear.',
            icon: <ShieldCheck size={18} className="text-[#B66D55]" strokeWidth={1.7} />,
        },
        {
            title: 'Secure Payment',
            text: 'Secure and trusted payment methods.',
            icon: <Lock size={18} className="text-[#B66D55]" strokeWidth={1.7} />,
        },
    ];

    return (
        <div className="min-h-screen bg-[#F9F6F1] text-[#2A241F]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <div className="relative overflow-hidden rounded-lg border border-[#E7DED3] bg-white">
                            <div className="relative aspect-[4/5]">
                                {images[activeImage] ? (
                                    <Image
                                        src={getImageUrl(images[activeImage])}
                                        alt={activeProduct.name}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#F2ECE4]">
                                        <ShoppingBag size={56} className="text-[#C8B39D]" />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#2A241F] shadow-sm"
                                    aria-label="Preview image"
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                                    className="grid h-10 w-10 place-items-center rounded-md border border-[#E7DED3] bg-white text-[#8A7B6D] hover:text-[#2A241F]"
                                    aria-label="Previous image"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>

                                <div className="flex flex-1 gap-3 overflow-x-auto py-1">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative h-16 w-16 flex-none overflow-hidden rounded-md border bg-white sm:h-20 sm:w-20 ${activeImage === idx ? 'border-[#B66D55] ring-1 ring-[#B66D55]' : 'border-[#E7DED3]'
                                                }`}
                                        >
                                            <Image
                                                src={getImageUrl(img)}
                                                alt={`${activeProduct.name} thumbnail ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                                    className="grid h-10 w-10 place-items-center rounded-md border border-[#E7DED3] bg-white text-[#8A7B6D] hover:text-[#2A241F]"
                                    aria-label="Next image"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-1">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#B66D55]">
                            {activeProduct.category_name}
                            {activeProduct.subcategory_name ? `  /  ${activeProduct.subcategory_name}` : ''}
                        </p>

                        <h1 className="text-3xl leading-tight text-[#1D1712] sm:text-5xl sm:leading-[1.05]">
                            {activeProduct.name}
                        </h1>

                        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                            {isDiscounted ? (
                                <>
                                    <span className="text-4xl text-[#1D1712]">{formatInr(activeProduct.discounted_price)}</span>
                                    <span className="text-2xl text-[#9E948A] line-through">{formatInr(currentPrice)}</span>
                                    {activeProduct.discount_text && (
                                        <span className="rounded-full bg-[#F0E5DC] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#B66D55]">
                                            {activeProduct.discount_text}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-4xl text-[#1D1712]">{formatInr(currentPrice)}</span>
                            )}
                        </div>

                        <div className="mt-8 border-t border-[#E7DED3] pt-7">
                            {coatings.length > 0 && (
                                <div className="mb-7">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="text-sm font-semibold uppercase tracking-wide text-[#1D1712]">Coating Type</span>
                                        <span className="text-sm text-[#6C6259]">{selectedVariant?.coating?.name || selectedVariant?.metal_type}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {coatings.map((coating) => {
                                            const isSelected =
                                                (selectedVariant?.coating?.name === coating.name) ||
                                                (!selectedVariant?.coating && selectedVariant?.metal_type === coating.name);

                                            return (
                                                <div key={coating.name} className="flex flex-col items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const variantForCoating = variants.find(
                                                                (v) =>
                                                                    (v.coating && v.coating.name === coating.name) ||
                                                                    (!v.coating && v.metal_type === coating.name)
                                                            );
                                                            if (variantForCoating) setSelectedVariantId(variantForCoating.id);
                                                        }}
                                                        className={`grid h-12 w-12 place-items-center rounded-full border-2 transition ${isSelected ? 'border-[#B66D55]' : 'border-[#E7DED3] hover:border-[#B66D55]'
                                                            }`}
                                                        title={coating.name}
                                                    >
                                                        <span
                                                            className="h-8 w-8 rounded-full border border-[#E5DDD3]"
                                                            style={{ backgroundColor: coating.color_rgb !== 'transparent' ? coating.color_rgb : '#ECE9E3' }}
                                                        />
                                                    </button>
                                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#7B7066]">
                                                        {coating.name.split(' ')[0]}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!selectedVariant) {
                                            toast.error('Please select a variant');
                                            return;
                                        }
                                        addToCartMutation.mutate();
                                    }}
                                    disabled={addToCartMutation.isPending || currentStock === 0}
                                    className="flex-1 rounded-md bg-[#D2704D] px-6 py-4 text-white transition hover:bg-[#BE5D3A] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <ShoppingBag size={18} strokeWidth={1.8} />
                                        <span className="text-sm font-semibold uppercase tracking-[0.13em]">
                                            {currentStock === 0 ? 'Out of Stock' : addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                                        </span>
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!session) {
                                            toast.error('Please sign in');
                                            return;
                                        }
                                        addToWishlistMutation.mutate();
                                    }}
                                    disabled={addToWishlistMutation.isPending}
                                    className="grid h-[56px] w-[56px] place-items-center rounded-md border border-[#E7DED3] bg-white text-[#9A8D7F] transition hover:text-[#B66D55]"
                                    aria-label="Add to wishlist"
                                >
                                    <Heart size={20} className={addToWishlistMutation.isPending ? 'animate-pulse' : ''} strokeWidth={1.8} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-5 border-b border-[#E7DED3] pb-7">
                                {productHighlights.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className="inline-flex cursor-default items-center gap-2 text-sm text-[#564C44]"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                    <div className="space-y-8">
                        <section className="border-t border-[#E7DED3] pt-8">
                            <h2 className="text-3xl uppercase tracking-[0.09em] text-[#1D1712]">Description</h2>
                            <div className="mt-4 h-[2px] w-8 bg-[#B66D55]" />
                            <p className="mt-5 text-[15px] leading-8 text-[#61574D]">
                                {activeProduct.description || 'No description available for this product yet.'}
                            </p>

                            <div className="mt-8 divide-y divide-[#EEE5DB] rounded-lg border border-[#EEE5DB] bg-[#FCFAF7]">
                                {descriptionItems.map((item) => (
                                    <div key={item.title} className="flex items-start gap-4 px-5 py-5">
                                        <span className="mt-1">{item.icon}</span>
                                        <div>
                                            <h3 className="text-2xl text-[#1D1712]">{item.title}</h3>
                                            <p className="mt-1 text-sm leading-7 text-[#665D54]">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {activeProduct.styling && (
                                <p className="mt-6 text-[14px] leading-7 text-[#74695F]">
                                    {activeProduct.styling}
                                </p>
                            )}
                        </section>

                        <section className="rounded-lg border border-[#E7DED3] bg-[#FCFAF7] p-5 sm:p-6">
                            <h3 className="text-2xl uppercase tracking-[0.08em] text-[#1D1712]">Shipping and Returns</h3>
                            <div className="mt-5 flex flex-col gap-4 text-sm text-[#5F554C] sm:flex-row sm:items-center sm:gap-8">
                                <div className="flex items-center gap-2">
                                    <FiTruck className="text-[#B66D55]" />
                                    <span>Free Shipping on all orders.</span>
                                </div>
                                <div className="hidden h-4 w-px bg-[#DDD1C6] sm:block" />
                                <div className="flex items-center gap-2">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M3 12a9 9 0 0 1 15-6.7" />
                                        <path d="M21 12a9 9 0 0 1-15 6.7" />
                                        <path d="m17 2 1 3-3-1" />
                                        <path d="m7 22-1-3 3 1" />
                                    </svg>
                                    <span>Final Sale: No Returns.</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-5">
                        <section className="rounded-2xl border border-[#E7DED3] bg-[#FCFAF7] p-6">
                            <div className="space-y-6">
                                {infoCardItems.map((item) => (
                                    <div key={item.title} className="flex items-start gap-4">
                                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F4EAE1]">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl uppercase tracking-[0.06em] text-[#1D1712]">{item.title}</h4>
                                            <p className="mt-1 text-sm leading-7 text-[#60564D]">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* <section className="rounded-xl border border-[#E7DED3] bg-[#F4ECE5] p-5">
                            <div className="flex items-center gap-4">
                                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#D2704D] text-white">
                                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M16.7 13.4c-.3-.2-1.8-.9-2-.9-.3-.1-.5-.1-.7.1-.2.2-.8.9-1 .9-.2 0-.4 0-.7-.2a8.3 8.3 0 0 1-2.4-2.1c-.2-.3-.2-.5 0-.7.1-.2.3-.4.4-.6.2-.2.2-.4.3-.6 0-.1 0-.4-.1-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5 4.5.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.8 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4z" />
                                        <path d="M12 22a10 10 0 1 0-5.7-1.8L2 22l1.9-4.2A10 10 0 0 0 12 22z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-3xl text-[#A06045]">Need Help?</h4>
                                    <p className="text-sm leading-7 text-[#655A50]">
                                        Chat with us on WhatsApp for any queries.
                                    </p>
                                </div>
                            </div>
                        </section> */}
                    </div>
                </div>

                <div className="mt-8 rounded-xl border border-[#E7DED3] bg-[#FCFAF7] px-6 py-5">
                    <div className="grid gap-5 place-items-center">
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={20} className="mt-1 text-[#B66D55]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2A241F]">Premium Quality</p>
                                <p className="text-xs text-[#6B6158]">Carefully crafted</p>
                            </div>
                        </div>
                        {/* <div className="flex items-start gap-3">
                            <Award size={20} className="mt-1 text-[#B66D55]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2A241F]">1 Year Color Guarantee</p>
                                <p className="text-xs text-[#6B6158]">On all PVD plated products</p>
                            </div>
                        </div> */}
                        {/* <div className="flex items-start gap-3">
                            <Heart size={20} className="mt-1 text-[#B66D55]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2A241F]">Loved by 10,000+ Customers</p>
                                <p className="text-xs text-[#6B6158]">For our quality and designs</p>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#E7DED3] bg-[#FCFAF7] px-6 py-4">
                    <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6D6259] sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#B66D55]" />
                            100% Secure Checkout
                        </div>
                        <div className="flex items-center gap-2">
                            <FiTruck size={14} className="text-[#B66D55]" />
                            Free Shipping Pan India
                        </div>
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px] text-[#B66D55]" stroke="currentColor" strokeWidth="1.8">
                                <path d="M3 12a9 9 0 0 1 15-6.7" />
                                <path d="M21 12a9 9 0 0 1-15 6.7" />
                                <path d="m17 2 1 3-3-1" />
                                <path d="m7 22-1-3 3 1" />
                            </svg>
                            Easy Exchange For Damaged Items
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
