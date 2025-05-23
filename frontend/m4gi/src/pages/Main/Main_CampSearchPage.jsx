import React from "react";
import Header from "../../components/Common/Header";
import SearchForm from "../../components/Main/UI/SearchForm";

export default function MainCampSearchPage() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="flex-1 w-full max-md:max-w-full">
        <Header showSearchBar={false} />
        <section className="flex-1 px-20 pt-2.5 w-full max-md:px-5 max-md:max-w-full">
          <SearchForm />
        </section>
      </div>
    </main>
  );
}

