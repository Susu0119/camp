import AdminUserList from "./Admin_UserList";

export function MainContent() {
  return (
    <main className="flex flex-col mt-14 text-4xl text-center text-fuchsia-800 max-md:mt-10 max-md:max-w-full">
      <h2 className="self-start ml-4 max-md:ml-2.5">
        사용자 관리
      </h2>
      <section className="content-images mt-10">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/18de0c5f86179803805f423f3b58ba62d082dc6e?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
          alt="User management dashboard"
          className="object-contain w-full rounded-3xl aspect-[6.37] shadow-[0px_2px_2px_rgba(0,0,0,0.25)] max-md:max-w-full"
        />
        <AdminUserList />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/26125062ad748e0c3288c38bc93ba3c7a9a99c1a?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
          alt="User actions"
          className="object-contain self-center mt-6 max-w-full aspect-[8] rounded-[30px] shadow-[0px_2px_2px_rgba(0,0,0,0.25)] w-[448px]"
        />
      </section>
    </main>
  );
}
