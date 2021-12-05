import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import {
  InstantSearch,
  Index,
  InfiniteHits,
  Snippet,
  Configure,
  SearchBox,
  Highlight,
  HierarchicalMenu,
  ClearRefinements,
  RefinementList,
  Stats,
  connectStateResults,
} from 'react-instantsearch-dom';
import './App.css';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const algoliaClient = algoliasearch(
  'CSDBX0SZMQ',
  '4bfa904cde10c4036e72bb5ad6a698d4'
);

const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      // Here we have to do something else
      console.log('empty search request?');
    }

    return algoliaClient.search(requests);
  },
};

const Results = connectStateResults(
  ({ searchState, searchResults, children }) =>
    searchResults && searchResults.nbHits !== 0 ? (
      children
    ) : (
      <div>Er werden geen resultaten gevonden voor {searchState.query}.</div>
    )
);

export default function App() {
  return (
    <div className="ais-InstantSearch">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt
        tellus lorem, sed porttitor neque gravida vitae.
      </p>
      <InstantSearch searchClient={searchClient} indexName="crawler_TG_All">
        <SearchBox
          autoFocus
          translations={{
            submitTitle: 'Verstuur je zoekopdracht',
            resetTitle: 'Maak je zoekopdracht leeg',
            placeholder: 'Zoek in artikelen en koopwijzers',
          }}
        />
        <Index indexName="crawler_TG_All">
          <Box sx={{ flexGrow: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Stats />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={2}>
                <Categories />
                <ContentTypes />
                <ClearRefinements
                  translations={{
                    reset: 'Verwijder alle filters',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={9} lg={9} xl={10}>
                <Configure hitsPerPage={10} />
                <Results>
                  <InfiniteHits
                    hitComponent={Hit}
                    translations={{
                      loadMore: 'Laad meer resultaten',
                    }}
                  />
                </Results>
              </Grid>
            </Grid>
          </Box>
        </Index>
      </InstantSearch>
    </div>
  );
}

function Categories(props) {
  return (
    <Card
      sx={{
        width: {
          xs: 1.0, // 100%
          sm: 1.0,
          md: 0.95,
        },
        borderRadius: 2,
        bgcolor: '#f2f2f2',
        border: 'none',
        margin: '10px 0',
      }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h5">Categorieën</Typography>
        <HierarchicalMenu attributes={['categories.lvl0', 'categories.lvl1']} />
      </CardContent>
    </Card>
  );
}

function ContentTypes(props) {
  return (
    <Card
      sx={{
        width: {
          xs: 1.0, // 100%
          sm: 1.0,
          md: 0.95,
        },
        borderRadius: 2,
        bgcolor: '#f2f2f2',
        border: 'none',
        margin: '10px 0',
      }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h5">Type</Typography>
        <RefinementList attribute="pageType" />
      </CardContent>
    </Card>
  );
}

function Hit(props) {
  return (
    <Card
      sx={{
        width: {
          xs: 1.0, // 100%
          sm: 250,
          md: 300,
        },
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image={props.hit.image}
        alt={props.hit.name}
      />
      <CardContent>
        <div className="hit-title">
          <Highlight attribute="title" hit={props.hit} />
        </div>
        <div className="hit-description">
          <Snippet attribute="text" hit={props.hit} />
        </div>
        <div className="hit-pagetype">{props.hit.pageType}</div>
        <div className="hit-pagepublicationdate">
          {props.hit.pagePublicationDate}
        </div>
      </CardContent>
      <CardActions>
        <a href={props.hit.url} target="_blank" rel="noreferrer">
          {props.hit.url}
        </a>
      </CardActions>
    </Card>
  );
}
