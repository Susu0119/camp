import React from 'react';
import Header from '../../components/Common/Header';
import SearchSection from '../../components/Notice/UI/SearchSection';
import AnnouncementTable from '../../components/Notice/UI/AnnouncementTable';
import Pagination from '../../components/Admin/UI/Admin_Pagination';

export const AnnouncementList = () => {
  return (
    <div className="flex flex-col items-center mx-auto my-0 bg-white h-[904px] w-[1440px] max-md:w-full max-md:max-w-screen-lg max-sm:w-full">
      <Header showSearchBar={false} />
      <main className="flex flex-col gap-4 justify-center items-center px-52 py-10 w-full max-md:px-12 max-md:py-8 max-sm:p-5">
        <h1 className="w-full text-3xl font-bold leading-8 text-black max-md:text-2xl max-sm:text-2xl">
          공지사항
        </h1>
        <SearchSection />
        <AnnouncementTable />
        <Pagination
            // currentPage={currentPage}
            // totalPages={totalPages}
            // onChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default AnnouncementList;
