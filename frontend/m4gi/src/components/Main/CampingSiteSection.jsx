import CampingSiteCard from "./Card";

export default function CampingSiteSection({ title, sites, variant = 'grid', backgroundColor = 'transparent' }) {
    return (
        <>
            {variant === 'grid' && (
                <section className="flex flex-col mt-5 w-full">
                    <h2 className="text-xl font-bold leading-snug ml-32 text-slate-950">{title}</h2>
                    <div className={`grid grid-cols-3 gap-5 items-start p-2.5 mt-5 w-full ${backgroundColor}`}>
                        {sites.map((site, index) => {
                            let alignmentClass = 'justify-center'; // 기본값은 중앙 정렬 (중앙 컬럼)
                            if (index % 3 === 0) { // 첫 번째 컬럼 (0, 3, 6, ...)
                                alignmentClass = 'justify-end'; // 우측 정렬
                            } else if (index % 3 === 2) { // 세 번째 컬럼 (2, 5, 8, ...)
                                alignmentClass = 'justify-start'; // 좌측 정렬
                            }

                            return (
                                // 각 카드를 div로 감싸고 flex와 정렬 클래스 적용
                                <div key={index} className={`flex ${alignmentClass} w-full`}>
                                    <CampingSiteCard site={site} />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {variant === 'horizontal' && (
                <section className="flex flex-col mt-5 w-[1440px]">
                    <h2 className="text-xl font-bold leading-snug text-slate-950">{title}</h2>
                    <div className="flex overflow-hidden gap-5 items-start self-stretch mt-5 w-full">
                        {sites.map((site, index) => (
                            <div key={index} className="flex overflow-visible flex-wrap gap-4 items-center">
                                <CampingSiteCard site={site} variant='small' />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {variant === 'new' && (
                <section className="flex flex-col mt-5 w-[1440px]">
                    <h2 className="text-xl font-bold leading-snug text-slate-950">{title}</h2>
                    <div className="flex overflow-hidden gap-5 items-start self-stretch mt-5 w-full">
                        {sites.map((site, index) => (
                            <div key={index} className="flex overflow-visible flex-wrap gap-4 items-center">
                                <CampingSiteCard key={index} site={{ ...site, isNew: true }} variant='small' />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex gap-2.5 items-start mt-5">
                <div className="flex shrink-0 w-2 h-2 bg-fuchsia-700 rounded-full" />
                <div className="flex shrink-0 w-2 h-2 bg-gray-300 rounded-full" />
            </div>
        </>
    );
};
