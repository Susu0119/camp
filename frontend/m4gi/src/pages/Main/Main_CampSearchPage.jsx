import React from "react";
import Header from "../../components/Common/Header";
import SearchForm from "../../components/Main/UI/SearchForm";

export default function MainCampSearchPage() {
  return (
    <main className="overflow-hidden">
      <div>
        <Header showSearchBar={false} />
        <section className="px-40 pt-3">
          <SearchForm />
        </section>
      </div>
    </main>
  );
}

