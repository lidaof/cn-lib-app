/* eslint complexity: off */

import { history as historyRouter } from 'instantsearch.js/es/lib/routers';

import type { UiState } from 'instantsearch.js';

type RouteState = {
  query?: string;
  page?: string;
  categoriess?: string[];
  languages?: string[];
  publishers?: string[];
  hitsPerPage?: string;
};

const routeStateDefaultValues: RouteState = {
  query: '',
  page: '1',
  categoriess: undefined,
  languages: undefined,
  publishers: undefined,
  hitsPerPage: '20',
};

const encodedCategories = {
  Chinese: 'Chinese language',
} as const;

type EncodedCategories = typeof encodedCategories;
type DecodedCategories = {
  [K in keyof EncodedCategories as EncodedCategories[K]]: K;
};

const decodedCategories = Object.keys(
  encodedCategories
).reduce<DecodedCategories>((acc, key) => {
  const newKey = encodedCategories[key as keyof EncodedCategories];
  const newValue = key;

  return {
    ...acc,
    [newKey]: newValue,
  };
}, {} as any);

// Returns a slug from the category name.
// Spaces are replaced by "+" to make
// the URL easier to read and other
// characters are encoded.
function getCategorySlug(name: string): string {
  const encodedName =
    decodedCategories[name as keyof DecodedCategories] || name;

  return encodedName.split(' ').map(encodeURIComponent).join('+');
}

// Returns a name from the category slug.
// The "+" are replaced by spaces and other
// characters are decoded.
function getCategoryName(slug: string): string {
  const decodedSlug =
    encodedCategories[slug as keyof EncodedCategories] || slug;

  return decodeURIComponent(decodedSlug.replace(/\+/g, ' '));
}

const originalWindowTitle = document.title;

const router = historyRouter<RouteState>({
  cleanUrlOnDispose: false,
  windowTitle({ categoriess, query }) {
    const queryTitle = query ? `搜索 "${query}" 的结果` : '';

    return [queryTitle, categoriess, originalWindowTitle]
      .filter(Boolean)
      .join(' | ');
  },

  createURL({ qsModule, routeState, location }): string {
    const { protocol, hostname, port = '', pathname, hash } = location;
    const portWithPrefix = port === '' ? '' : `:${port}`;
    const urlParts = location.href.match(/^(.*?)\/search/);
    const baseUrl =
      (urlParts && urlParts[0]) ||
      `${protocol}//${hostname}${portWithPrefix}${pathname}search`;

   const queryParameters: Partial<RouteState> = {};

    if (
      routeState.query &&
      routeState.query !== routeStateDefaultValues.query
    ) {
      queryParameters.query = encodeURIComponent(routeState.query);
    }
    if (routeState.page && routeState.page !== routeStateDefaultValues.page) {
      queryParameters.page = routeState.page;
    }
    if (
      routeState.categoriess &&
      routeState.categoriess !== routeStateDefaultValues.categoriess
    ) {
      queryParameters.categoriess = routeState.categoriess.map(encodeURIComponent);
    }
    if (
      routeState.languages &&
      routeState.languages !== routeStateDefaultValues.languages
    ) {
      queryParameters.languages = routeState.languages.map(encodeURIComponent);
    }
    if (
      routeState.publishers &&
      routeState.publishers !== routeStateDefaultValues.publishers
    ) {
      queryParameters.publishers = routeState.publishers.map(encodeURIComponent);
    }
    if (
      routeState.hitsPerPage &&
      routeState.hitsPerPage !== routeStateDefaultValues.hitsPerPage
    ) {
      queryParameters.hitsPerPage = routeState.hitsPerPage;
    }

    const queryString = qsModule.stringify(queryParameters, {
      addQueryPrefix: true,
      arrayFormat: 'repeat',
    });

    return `${baseUrl}/${queryString}${hash}`;
  },

  parseURL({ qsModule, location }): RouteState {
    const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);
    const category = getCategoryName(
      (pathnameMatches && pathnameMatches[1]) || ''
    );

    const queryParameters = qsModule.parse(location.search.slice(1));
    const {
      query = '',
      page = 1,
      categoriess = [],
      languages = [],
      publishers = [],
      hitsPerPage,
    } = queryParameters;

    // `qs` does not return an array when there's a single value.
    const allCategoriess = (
      Array.isArray(categoriess) ? categoriess : [categoriess].filter(Boolean)
    ) as string[];
    const allLanguages = (
      Array.isArray(languages) ? languages : [languages].filter(Boolean)
    ) as string[];
    const allPublishers = (
      Array.isArray(publishers) ? publishers : [publishers].filter(Boolean)
    ) as string[];

    return {
      query: decodeURIComponent(query as string),
      page: page as string,
      categoriess: allCategoriess.map(decodeURIComponent),
      languages: allLanguages.map(decodeURIComponent),
      publishers: allPublishers.map(decodeURIComponent),
      hitsPerPage: hitsPerPage as string,
    };
  },
});

const getStateMapping = ({ indexName }: { indexName: string }) => ({
  stateToRoute(uiState: UiState): RouteState {
    const indexUiState = uiState[indexName];
    return {
      query: indexUiState.query,
      page: (indexUiState.page && String(indexUiState.page)) || undefined,
      categoriess: indexUiState.refinementList && indexUiState.refinementList.categories,
      languages: indexUiState.refinementList && indexUiState.refinementList.language,
      publishers: indexUiState.refinementList && indexUiState.refinementList.publisher,
      hitsPerPage:
        (indexUiState.hitsPerPage && String(indexUiState.hitsPerPage)) ||
        undefined,
    };
  },

  routeToState(routeState: RouteState): UiState {
    

    const refinementList: { [key: string]: string[] } = {};
    if (routeState.categoriess) {
      refinementList.categories = routeState.categoriess;
    }
    if (routeState.languages) {
      refinementList.language = routeState.languages;
    }
    if (routeState.publishers) {
      refinementList.publisher = routeState.publishers;
    }


    

    return {
      [indexName]: {
        query: routeState.query,
        page: Number(routeState.page),
        refinementList,
        hitsPerPage: Number(routeState.hitsPerPage),
      },
    };
  },
});

const getRouting = (indexName: string) => ({
  router,
  stateMapping: getStateMapping({ indexName }),
});

export default getRouting;
