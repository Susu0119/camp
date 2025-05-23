import React from "react";


export default function DateSelector () {
  return (
    <section className="flex flex-col justify-center p-5 mt-5 w-full rounded-xl border-2 border-solid border-neutral-100">
      <h3 className="p-2.5 w-full text-base text-neutral-900">
        날짜를 선택 해주세요.
      </h3>
      <div className="px-12 pb-4 mt-2.5 w-full">
        <div className="flex flex-wrap gap-10 justify-between items-center pb-2.5 w-full">
          <div className="gap-2.5 self-stretch p-2.5 my-auto text-lg text-fuchsia-700">
            2025년 5월
          </div>
          <div className="flex gap-1 items-center self-stretch my-auto">
            <button>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f5a293b388661aea353f575e37ec726f39f4124?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
                alt="Previous month"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
            </button>
            <button>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/53a935461d37d6fd3a8456c2099bd5ee16b5d808?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
                alt="Next month"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-10 justify-between items-center px-8 mt-2.5 w-full text-base whitespace-nowrap text-neutral-900">
          <div className="self-stretch my-auto w-[15px]">일</div>
          <div className="self-stretch my-auto w-[15px]">월</div>
          <div className="self-stretch my-auto w-[15px]">화</div>
          <div className="self-stretch my-auto w-[15px]">수</div>
          <div className="self-stretch my-auto w-[15px]">목</div>
          <div className="self-stretch my-auto w-[15px]">금</div>
          <div className="self-stretch my-auto w-[15px]">토</div>
        </div>
        <div className="py-2.5 mt-2.5 w-full text-base text-center whitespace-nowrap text-neutral-900">
          <CalendarWeek
            days={["1", "2", "1", "1", "1", "2", "3"]}
            textColors={["text-white", "text-white", "text-white", "text-white", "text-neutral-900", "text-neutral-900", "text-neutral-900"]}
          />
          <div className="flex flex-wrap gap-10 justify-between items-center px-8 pt-4 mt-2.5 w-full">
            <button className="self-stretch my-auto w-5">4</button>
            <button className="self-stretch my-auto w-5">5</button>
            <button className="self-stretch my-auto w-5">6</button>
            <div className="flex gap-10 justify-between items-center self-stretch p-1.5 my-auto rounded-xl bg-fuchsia-700 bg-opacity-20 w-[374px]">
              <button className="self-stretch my-auto w-5">7</button>
              <button className="self-stretch my-auto w-5">8</button>
              <button className="self-stretch my-auto w-5">9</button>
            </div>
            <button className="self-stretch my-auto w-5">10</button>
          </div>
          <CalendarWeek
            days={["11", "12", "13", "14", "15", "16", "17"]}
            textColors={Array(7).fill("text-neutral-900")}
          />
          <CalendarWeek
            days={["18", "19", "20", "21", "22", "23", "24"]}
            textColors={Array(7).fill("text-neutral-900")}
            widths={["w-5", "w-5", "w-[22px]", "w-[22px]", "w-5", "w-5", "w-5"]}
          />
          <CalendarWeek
            days={["25", "26", "27", "28", "29", "30", "31"]}
            textColors={Array(7).fill("text-neutral-900")}
            widths={["w-5", "w-5", "w-[22px]", "w-[22px]", "w-5", "w-[22px]", "w-5"]}
          />
        </div>
      </div>
    </section>
  );
};

const CalendarWeek = ({ days, textColors, widths = Array(7).fill("w-5") }) => {
  return (
    <div className="flex flex-wrap flex-1 gap-10 justify-between items-center px-8 pt-4 text-white size-full">
      {days.map((day, index) => (
        <button key={index} className={`self-stretch my-auto ${widths[index]} ${textColors[index]}`}>
          {day}
        </button>
      ))}
    </div>
  );
};
