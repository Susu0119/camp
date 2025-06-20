export default function CategorySection({ onCategoryClick  }) {
    // Array of category items
    const categories = [
        { name: "캠핑",     value: "CAMPING",       image: 'https://storage.googleapis.com/m4gi/images/1.png' },
        { name: "글램핑",   value: "GLAMPING",      image: 'https://storage.googleapis.com/m4gi/images/2.png' },
        { name: "카라반",   value: "CARAVAN",       image: 'https://storage.googleapis.com/m4gi/images/3.png' },
        { name: "차박",     value: "AUTO",          image: 'https://storage.googleapis.com/m4gi/images/4.png' }, // 차박을 오토캠핑(AUTO)으로 가정
        { name: "반려동물", value: "PET_ALLOWED",   image: 'https://storage.googleapis.com/m4gi/images/5.png' },
        { name: "키즈",     value: "KIDS_ALLOWED",  image: 'https://storage.googleapis.com/m4gi/images/6.png' },
        { name: "캠프닉",   value: "CAMPNIC",       image: 'https://storage.googleapis.com/m4gi/images/7.png' },
        { name: "찜",       value: "WISHLIST",      image: 'https://storage.googleapis.com/m4gi/images/8.png' }
    ];

    return (
        <section className="flex overflow-hidden gap-10 justify-center items-center text-xl font-bold leading-none text-center text-black whitespace-nowrap h-[110px] w-[1322px]">
            {categories.map((category, index) => (
                <div
                    key={index}
                    onClick={() => onCategoryClick(category.value)}
                    className="flex overflow-hidden cursor-pointer gap-1 items-center flex-col grow shrink self-stretch px-1 my-auto bg-white bg-opacity-0 min-h-[103px] w-[74px]"
                >
                    <img
                        src={category.image}
                        alt={category.name}
                        className="object-contain aspect-[1.15] w-[95px]"
                    />
                    <p className="mt-1">{category.name}</p>
                </div>
            ))}
        </section>
    );
};
