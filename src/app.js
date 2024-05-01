const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  'KOYTPDN0H7',
  '961ad9d81e5f862a45042893130ac1ac'
);

const search = instantsearch({
  indexName: 'cn-library-books',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
  insights: true,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: '搜索书籍',
  }),
  instantsearch.widgets.stats({
    container: '#stats',
    templates: {
      text(data, { html }) {
        let count = '';

        if (data.hasManyResults) {
          count += `找到 ${data.nbHits} 本书`;
        } else if (data.hasOneResult) {
          count += `找到 1 本书`;
        } else {
          count += `没找到所搜索的书籍`;
        }

        return html`<span>耗时 ${data.processingTimeMS}ms ${count}</span>`;
      },
    },
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <article>
          <img src=${hit.image_url} alt=${hit.Title} />
          <div>
            <h1>${components.Highlight({ hit, attribute: 'Title' })}</h1>
            <p>${hit.Authors}</p>
            <p>${hit.Description}</p>
          </div>
        </article>
      `,
    },
  }),
  // instantsearch.widgets.infiniteHits({
  //   container: '#infinite-hits-container',
  //   templates: {
  //     item: (hit, { html, components }) => html`
  //       <article>
  //         <img src=${hit.image_url} alt=${hit.Title} />
  //         <div>
  //           <h1>${components.Highlight({ hit, attribute: 'Title' })}</h1>
  //         </div>
  //       </article>
  //     `,
  //   },
  // }),
  instantsearch.widgets.configure({
    hitsPerPage: 20,
  }),
  instantsearch.widgets.panel({
    templates: {
      header: () => '分类',
    },
  })(instantsearch.widgets.refinementList)({
    searchable: true,
    searchablePlaceholder: '搜索分类',
    container: '#Categories-list',
    attribute: 'Categories',
    limit: 10,
    showMore: true,
    templates: {
      showMoreText(data, { html }) {
        return html`<span>${data.isShowingMore ? '更少' : '更多'}</span>`;
      },
    },
    // transformItems(items) {
    //   return items.map((item) => ({
    //     ...item,
    //     label:
    //       item.label.length > 10 ? `${item.label.slice(0, 7)}...` : item.label,
    //   }));
    // },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
