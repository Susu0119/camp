import { useState } from 'react';

export default function BannerSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const banners = [
        { id: 1, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 1" },
        { id: 2, image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/9fe4ed7e359d2eafce08baace6ad0df8cc370c71?placeholderIfAbsent=true", alt: "Event banner 2" }
    ];

    return (
        <section className="flex flex-col items-center">
            <div className="flex overflow-hidden flex-col justify-center mt-5 max-w-full rounded-lg min-h-[353px] w-[1323px]">
                <div className="flex overflow-hidden gap-5 w-full min-h-[353px]">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="flex overflow-hidden flex-col flex-1 shrink justify-center rounded-lg basis-0 max-w-[1336px] min-w-60"
                        >
                            <img
                                src={banner.image}
                                alt={banner.alt}
                                className="object-contain flex-1 w-full aspect-[1.85]"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-2.5 items-start mt-5">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`flex shrink-0 w-2 h-2 ${index === activeIndex ? 'bg-fuchsia-700' : 'bg-gray-300'
                            } rounded-full`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
