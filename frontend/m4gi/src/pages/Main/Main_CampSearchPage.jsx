import React from "react";
import Header from "../../components/Common/Header";
import SearchForm from "../../components/Main/UI/SearchForm";

export default function MainCampSearchPage() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="flex-1 w-full">
        <Header showSearchBar={false} />
        <section className="flex-1 px-20 pt-2.5 w-full">
          <SearchForm />
        </section>
      </div>
    </main>
  );
}

