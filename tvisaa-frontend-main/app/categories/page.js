import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

// Cache all categories for 24 hours at the Edge
export const revalidate = 86400;

async function getCategories() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return [];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const res = await fetch(`${apiUrl}/categories/`, {
            next: { tags: ['categories'] }, // Allows on-demand revalidation from Django
            signal: controller.signal,
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data?.results || data?.data?.results || data?.data || []);
    } catch (e) {
        return [];
    } finally {
        clearTimeout(timeoutId);
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-14">
                <p className="text-gold text-sm tracking-[0.3em] uppercase font-jost font-light mb-3">Browse</p>
                <h1 className="font-cormorant text-4xl sm:text-5xl text-noir">All Collections</h1>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-20 text-mid">No categories found.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group block bg-white border border-blush/50 hover:border-deep-rose/30 hover:shadow-lg transition-all"
                        >
                            <div className="aspect-[3/4] bg-petal flex items-center justify-center">
                                <div className="text-center p-6">
                                    <h2 className="font-cormorant text-2xl text-noir group-hover:text-deep-rose transition-colors mb-2">
                                        {cat.name}
                                    </h2>
                                    <p className="text-xs text-mid font-light mb-3">{cat.product_count || 0} products</p>
                                    {cat.subcategories?.length > 0 && (
                                        <div className="space-y-1 mb-4 hidden sm:block">
                                            {cat.subcategories.slice(0, 3).map((sub) => (
                                                <p key={sub.id} className="text-xs text-mid/60">{sub.name}</p>
                                            ))}
                                        </div>
                                    )}
                                    <span className="inline-flex items-center text-xs text-deep-rose font-jost tracking-wider uppercase mt-2">
                                        Shop Now <FiArrowRight className="ml-1" size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
