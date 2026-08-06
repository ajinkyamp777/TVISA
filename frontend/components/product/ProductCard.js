'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { normalizeImageUrl } from '@/lib/images';

export default function ProductCard({ product }) {
    const price = product.base_price;
    const primaryImage = normalizeImageUrl(product.primary_image || product.image_url || product.cloudinary_url || '');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group block cursor-pointer"
        >
            <Link href={`/products/${product.id}`} className="block">
                {/* Image Container - Aspect 4/5 for elegant Jewex style */}
                <div className="relative w-full aspect-[4/5] bg-[#F3EFEA] overflow-hidden mb-4">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiShoppingBag size={40} className="text-[#8C7C66] opacity-50" />
                        </div>
                    )}

                    {/* Minimalist Hover Overlay for actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick actions overlay */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#31271D] hover:text-[#F9F6F0] text-[#31271D]"
                        aria-label="Add to wishlist"
                    >
                        <FiHeart size={16} />
                    </button>
                </div>

                {/* Minimalist Product Info */}
                <div className="flex justify-between items-start">
                    <div className="pr-4">
                        <h3 className="font-jost text-[13px] sm:text-[14px] text-[#31271D] font-medium leading-snug line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="font-jost text-[12px] text-[#8C7C66] mt-1 uppercase tracking-wider">
                            {product.category_name || 'Jewelry'}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="font-jost text-[13px] sm:text-[14px] flex flex-col items-end">
                            {(product.discounted_price && Number(product.discounted_price) > 0) ? (
                                <>
                                    <span className="text-[#31271D] font-medium">₹{Number(product.discounted_price).toLocaleString('en-IN')}</span>
                                    <span className="text-[#8C7C66] line-through text-[11px] mt-0.5">₹{Number(price).toLocaleString('en-IN')}</span>
                                </>
                            ) : (
                                <span className="text-[#31271D] font-medium">₹{Number(price).toLocaleString('en-IN')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
