import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Main/UI/Footer";
import FilterSection from "../../components/Main/UI/FilterSection";
import CampingCardSection from "../../components/Main/UI/CampingSearchResultCardSection";

export default function CampingSearchPage () {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <main>
      <section className="w-full">
        <Header />
        <div className="px-15 my-6 w-full">
          <FilterSection />
          <CampingCardSection campingData={searchResults} />
        </div>
        <Footer />
      </section>
    </main>
  );
};

