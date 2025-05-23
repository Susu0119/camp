export function AdminUserProfile() {
  return (
    <div className="flex gap-3 mt-14 ml-5 text-3xl max-md:mt-10 max-md:ml-2.5">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ab39275ea8c798a8872ddc046c29314f05369d9?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
        alt="Admin profile"
        className="object-contain shrink-0 self-start aspect-square w-[35px]"
      />
      <span className="basis-auto">관리자 님</span>
    </div>
  );
}
