import React, { useState } from "react";

export default function PersonCountSelector () {
  const [peopleCount, setPeopleCount] = useState(3);

  const decreasePeople = () => {
    if (peopleCount > 1) {
      setPeopleCount(peopleCount - 1);
    }
  };

  const increasePeople = () => {
    setPeopleCount(peopleCount + 1);
  };

  return (
    <section className="flex flex-col justify-center p-5 mt-5 w-full text-base rounded-xl border-2 border-solid border-neutral-100">
      <h3 className="p-2.5 w-full text-neutral-900">
        인원 수를 선택 해주세요.
      </h3>
      <div className="mt-2.5 w-full">
        <div className="flex flex-wrap gap-2.5 justify-center w-full whitespace-nowrap text-neutral-900">
          <div className="flex flex-1 shrink gap-2.5 items-start self-start basis-0">
            <div className="flex-1 shrink p-2.5 w-full basis-0">
              인원
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center pr-2.5 h-full">
            <div className="flex shrink-0 self-stretch my-auto w-6 h-6" />
            <button onClick={decreasePeople} aria-label="Decrease people count">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f51184ffe44c0e86e48250e91f288d079e815ff4?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
                alt="Decrease"
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              />
            </button>
            <span className="self-stretch my-auto">{peopleCount}</span>
            <button onClick={increasePeople} aria-label="Increase people count">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/79e1d244837d6d33f3c57435f7b3b940563de9f5?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
                alt="Increase"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
            </button>
          </div>
        </div>
        <p className="p-2.5 w-full text-neutral-400">
          유아 및 아동도 인원 수에 포함 해주세요.
        </p>
      </div>
    </section>
  );
};

