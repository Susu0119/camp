export default function CategorySection() {
    // Array of category items
    const categories = [
        {
            name: "캠핑",
            image: '/1.svg' // 수정된 링크
        },
        {
            name: "글램핑",
            image: '/2.svg'
        },
        {
            name: "카라반",
            image: '/3.svg'
        },
        {
            name: "차박",
            image: '/4.svg'
        },
        {
            name: "반려동물",
            image: '/5.svg'
        },
        {
            name: "키즈",
            image: '/6.svg'
        },
        {
            name: "캠프닉",
            image: '/7.svg'
        },
        {
            name: "찜",
            image: '/8.svg'
        }
    ]

    return (
        <section className="flex overflow-hidden gap-10 justify-center items-center text-xl font-bold leading-none text-center text-black whitespace-nowrap h-[85px] w-[1322px]">
            {categories.map((category, index) => (
                <div
                    key={index}
                    className="flex overflow-hidden gap-2 items-center flex-col grow shrink self-stretch px-1 my-auto bg-white bg-opacity-0 min-h-[103px] w-[74px]"
                >
                    <img
                        src={category.image}
                        alt={category.name}
                        className="object-contain aspect-[1.15] w-[60px]"
                    />
                    <p className="mt-1">{category.name}</p>
                </div>
            ))}
        </section>
    );
};
