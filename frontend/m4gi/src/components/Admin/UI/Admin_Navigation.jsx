export function AdminNavigation() {
  return (
    <ul className="w-full list-none p-0">
      <li className="mt-8 ml-5 max-md:ml-2.5">
        <a href="#" className="text-white hover:text-gray-200">캠핑장 관리</a>
      </li>
      <li className="mt-9 ml-4 max-md:ml-2.5">
        <a href="#" className="text-white hover:text-gray-200">예약 관리</a>
      </li>
      <li className="self-stretch px-4 py-2 mt-7 text-black rounded-2xl bg-zinc-400 max-md:pr-5">
        <a href="#" className="text-black">사용자 관리</a>
      </li>
      <li className="mt-7 ml-4 max-md:ml-2.5">
        <a href="#" className="text-white hover:text-gray-200">결제 관리</a>
      </li>
      <li className="mt-9 ml-4 max-md:ml-2.5">
        <a href="#" className="text-white hover:text-gray-200">리뷰/평점 관리</a>
      </li>
      <li className="mt-9 ml-5 max-md:ml-2.5">
        <a href="#" className="text-white hover:text-gray-200">문의/고객센터 관리</a>
      </li>
      <li className="self-center mt-8">
        <a href="#" className="text-white hover:text-gray-200">공지사항/이벤트 관리</a>
      </li>
      <li className="mt-8">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/888e985f0427b0066b906e801a6a5f08d497e8ac?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
          alt="Divider"
          className="object-contain self-stretch ml-2.5 w-full aspect-[250] max-md:mr-2.5"
        />
      </li>
    </ul>
  );
}
