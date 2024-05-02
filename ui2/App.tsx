import algoliasearch from 'algoliasearch/lite';
import React, { useRef } from 'react';
import {
  Configure,
  Hits,
  HitsPerPage,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  Highlight,
  Snippet,
} from 'react-instantsearch';

import {
  AlgoliaSvg,
  ClearFilters,
  ClearFiltersMobile,
  NoResults,
  NoResultsBoundary,
  Panel,
  ResultsNumberMobile,
  SaveFiltersMobile,
} from './components';
import { ScrollTo } from './components/ScrollTo';
import getRouting from './routing';
import './Theme.css';
import './App.css';
import './components/Pagination.css';
import './App.mobile.css';

import type { Hit as AlgoliaHit } from 'instantsearch.js';

const searchClient = algoliasearch(
  'KOYTPDN0H7',
  '961ad9d81e5f862a45042893130ac1ac'
);

const indexName = 'cn-library-books';
const routing = getRouting(indexName);

export function App() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef(null);

  function openFilters() {
    document.body.classList.add('filtering');
    window.scrollTo(0, 0);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('click', onClick);
  }

  function closeFilters() {
    document.body.classList.remove('filtering');
    containerRef.current!.scrollIntoView();
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('click', onClick);
  }

  function onKeyUp(event: { key: string }) {
    if (event.key !== 'Escape') {
      return;
    }

    closeFilters();
  }

  function onClick(event: MouseEvent) {
    if (event.target !== headerRef.current) {
      return;
    }

    closeFilters();
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      routing={routing}
      insights={true}
    >
      <header className="header" ref={headerRef}>
        <p className="header-logo">
          <AlgoliaSvg />
        </p>

        <p className="header-title">圣路易现代中文学校图书馆</p>

        <SearchBox
          placeholder="搜索书籍 …"
          submitIconComponent={SubmitIcon}
        />
      </header>

      <Configure
        attributesToSnippet={['description:20']}
        snippetEllipsisText="…"
        removeWordsIfNoResults="allOptional"
      />

      <ScrollTo>
        <main className="container" ref={containerRef}>
          <div className="container-wrapper">
            <section className="container-filters" onKeyUp={onKeyUp}>
              <div className="container-header">
                <h2>Filters</h2>

                <div className="clear-filters" data-layout="desktop">
                  <ClearFilters />
                </div>

                <div className="clear-filters" data-layout="mobile">
                  <ResultsNumberMobile />
                </div>
              </div>

              <div className="container-body">
                <Panel header="分类">
                  <RefinementList
                    attribute="categories"
                    searchable={true}
                    searchablePlaceholder="搜索分类…"
                  />
                </Panel>

                <Panel header="语言">
                  <RefinementList
                    attribute="language"
                    searchable={false}
                  />
                </Panel>

                <Panel header="出版社">
                  <RefinementList
                    attribute="publisher"
                    searchable={true}
                    searchablePlaceholder="搜索出版社…"
                  />
                </Panel>

                {/* <Panel header="Price">
                  <PriceSlider attribute="price" />
                </Panel>

                <Panel header="Free shipping">
                  <ToggleRefinement
                    attribute="free_shipping"
                    label="Display only items with free shipping"
                    on={true}
                  />
                </Panel>

                <Panel header="Ratings">
                  <Ratings attribute="rating" />
                </Panel> */}
              </div>
            </section>

            <footer className="container-filters-footer" data-layout="mobile">
              <div className="container-filters-footer-button-wrapper">
                <ClearFiltersMobile containerRef={containerRef} />
              </div>

              <div className="container-filters-footer-button-wrapper">
                <SaveFiltersMobile onClick={closeFilters} />
              </div>
            </footer>
          </div>

          <section className="container-results">
            <header className="container-header container-options">
              {/* <SortBy
                className="container-option"
                items={[
                  {
                    label: 'Sort by featured',
                    value: 'instant_search',
                  },
                  {
                    label: 'Price ascending',
                    value: 'instant_search_price_asc',
                  },
                  {
                    label: 'Price descending',
                    value: 'instant_search_price_desc',
                  },
                ]}
              /> */}

              <HitsPerPage
                className="container-option"
                items={[
                  {
                    label: '每页16本书',
                    value: 16,
                    default: true,
                  },
                  {
                    label: '每页32本书',
                    value: 32,
                  },
                  {
                    label: '每页64本书',
                    value: 64,
                  },
                ]}
              />
            </header>

            <NoResultsBoundary fallback={<NoResults />}>
              <Hits hitComponent={Hit} />
            </NoResultsBoundary>

            <footer className="container-footer">
              <Pagination padding={2} showFirst={false} showLast={false} />
            </footer>
          </section>
        </main>
      </ScrollTo>

      <aside data-layout="mobile">
        <button
          className="filters-button"
          data-action="open-overlay"
          onClick={openFilters}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
            <path
              d="M15 1H1l5.6 6.3v4.37L9.4 13V7.3z"
              stroke="#fff"
              strokeWidth="1.29"
              fill="none"
              fillRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Filters
        </button>
      </aside>
    </InstantSearch>
  );
}

function SubmitIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        transform="translate(1 1)"
      >
        <circle cx="7.11" cy="7.11" r="7.11" />
        <path d="M16 16l-3.87-3.87" />
      </g>
    </svg>
  );
}

type HitType = AlgoliaHit<{
  image: string;
  name: string;
  authors: string;
  publisher: string;
  language: string;
  categories: string[];
  description: string;
  // price: number;
  // rating: string;
}>;

function Hit({ hit }: { hit: HitType }) {
  return (
    <article className="hit">
      <header className="hit-image-container">
        <img src={hit.image} alt={hit.name} className="hit-image" />
      </header>

      <div className="hit-info-container">
        <p className="hit-category">{hit.categories[0]}</p>
        <h1>
          <Highlight attribute="name" highlightedTagName="mark" hit={hit} />
        </h1>
        <p className="hit-description">
          <Snippet
            attribute="description"
            highlightedTagName="mark"
            hit={hit}
          />
        </p>

        <footer>
          <p>
            <span className="hit-em">{hit.authors}</span><br />
            <span className="hit-rating">
              {hit.publisher}
            </span>
          </p>
        </footer>
      </div>
    </article>
  );
}
