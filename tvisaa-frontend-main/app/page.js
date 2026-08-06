import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import HeroSliderClient from '@/components/home/HeroSliderClient';
import HappyCustomersClient from '@/components/home/HappyCustomersClient';
import ProductCard from '@/components/product/ProductCard';
import PromoBanner from '@/components/home/PromoBanner';

export const revalidate = 60;

async function getHomepageData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/homepage/all/`, {
            next: { tags: ['hero', 'products', 'instagram'] },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (e) {
        return null;
    }
}

export default async function HomePage() {
    const homepageData = await getHomepageData();

    const heroSlides    = homepageData?.hero_sliders   ?? [];
    const bestSellers   = homepageData?.bestsellers    ?? [];
    const quickPicks    = homepageData?.quick_picks    ?? [];
    const newArrivals   = homepageData?.new_arrivals   ?? [];
    const instaPosts    = homepageData?.instagram_posts ?? [];

    const features = [
        {
            title: "Waterproof",
            desc: "Designed to be worn every day, everywhere. Never take it off.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3s-4.5 4.97-4.5 9 2.015 9 4.5 9z" /></svg>
        },
        {
            title: "Tarnish Resistant",
            desc: "Crafted with premium materials that retain their brilliant shine forever.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
        },
        {
            title: "Hypoallergenic",
            desc: "Gentle on sensitive skin. Zero nickel, zero lead, zero irritation.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            title: "Free Delivery",
            desc: "Enjoy complimentary express shipping on all orders across the country.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
        }
    ];

    return (
        <div className="bg-[#F9F6F0]">
            {/* 1. Hero */}
            <HeroSliderClient slides={heroSlides} />

            {/* 2. Marquee / Promo Banner */}
            <PromoBanner />

            

            {/* 3. Top Picks (Best Sellers) */}
            <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#F9F6F0]">
                <div className="text-center mb-16">
                    <h2 className="font-cormorant text-4xl md:text-5xl text-[#31271D] mb-4 max-w-2xl mx-auto leading-tight">
                        Sparkle in Every Moment: Shop Our Best-Selling Jewelry Today
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {bestSellers.length > 0 ? bestSellers.slice(0, 8).map((product) => (
                        <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-[#8C7C66] font-jost">More products arriving soon...</div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/products?filter=bestseller" className="inline-flex items-center justify-center gap-2 text-sm font-jost uppercase tracking-widest text-[#31271D] border border-[#31271D] px-8 py-3 hover:bg-[#31271D] hover:text-[#F9F6F0] transition-colors duration-300">
                        View Best Sellers <FiArrowRight />
                    </Link>
                </div>
            </section>
            
            {/* 2.5 Promotional Image Block */}
            <section className="w-full relative h-[300px] md:h-[450px] lg:h-[600px] overflow-hidden pb-10">
    <Image 
        src="/images/promobanner.jpeg" 
        alt="Promotional Banner" 
        fill 
        className="object-cover object-center" 
    />
</section>

            {/* 4. Quick Picks (Explore) */}
            <section className="pb-20 pt-12 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#F9F6F0]">
                <div className="text-center mb-16">
                    <h2 className="font-cormorant text-4xl md:text-5xl text-[#31271D] mb-4 max-w-2xl mx-auto leading-tight">
                        Curated Elegance: Explore Our Quick Picks
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {quickPicks.length > 0 ? quickPicks.slice(0, 8).map((product) => (
                        <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-[#8C7C66] font-jost">More quick picks arriving soon...</div>
                    )}
                </div>
                <div className="mt-16 text-center">
                    <Link href="/products?filter=quick_picks" className="inline-flex items-center justify-center gap-2 text-sm font-jost uppercase tracking-widest text-[#31271D] border border-[#31271D] px-8 py-3 hover:bg-[#31271D] hover:text-[#F9F6F0] transition-colors duration-300">
                        View All Collections <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* 5. New Arrivals */}
            <section className="pb-20 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#F9F6F0]">
                <div className="text-center mb-16">
                    <h2 className="font-cormorant text-4xl md:text-5xl text-[#31271D] mb-4 max-w-2xl mx-auto leading-tight">
                        Fresh Designs: Discover Our New Arrivals
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {newArrivals.length > 0 ? newArrivals.slice(0, 8).map((product) => (
                        <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-[#8C7C66] font-jost">More fresh designs arriving soon...</div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/products?filter=new_arrival" className="inline-flex items-center justify-center gap-2 text-sm font-jost uppercase tracking-widest text-[#31271D] border border-[#31271D] px-8 py-3 hover:bg-[#31271D] hover:text-[#F9F6F0] transition-colors duration-300">
                        View All Collections <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* 6. Why Choose Tvisaa (Updated to match aesthetic) */}
            <section className="py-24 bg-[#EAE4D9]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {features.map((feature, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="text-[#31271D] mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    {feature.svg}
                                </div>
                                <h3 className="font-cormorant text-2xl text-[#31271D] mb-3">{feature.title}</h3>
                                <p className="font-jost text-sm text-[#8C7C66] leading-relaxed max-w-[250px]">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Happy Customers & Trust Strip */}
            {/* <HappyCustomersClient posts={instaPosts} /> */}
        </div>
    );
}
