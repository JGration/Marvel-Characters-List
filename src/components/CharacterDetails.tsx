import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCharacterDetails } from '../store/characterActions';
import { ResponsivePie } from '@nivo/pie';
import './CharacterDetails.scss';

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { characterDetails: character, loading, error } = useAppSelector((state) => state.characters);

  useEffect(() => {
    if (id) {
      dispatch(fetchCharacterDetails(Number(id)));
    }
  }, [id, dispatch]);

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (character) return <CharacterContent character={character} />;
    return <NoCharacterState />;
  };

  return (
    <div className="character-details">
      <button onClick={() => navigate('/')} className="character-details__go-back-button">
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
        <span className="sr-only">Go back</span>
      </button>
      {renderContent()}
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="character-details__loading">
    <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading...
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="character-details__error">
    <i className="fas fa-exclamation-triangle" aria-hidden="true"></i> Error: {error}
  </div>
);

const NoCharacterState: React.FC = () => (
  <div className="character-details__no-character">
    <i className="fas fa-question-circle" aria-hidden="true"></i> Error loading character details
  </div>
);

const getComicPhrases = (comics: any[]): { id: string, label: string, value: number }[] => {
  const phraseCounts: { [key: string]: number } = {};

  comics.forEach((comic) => {
    const phrase = comic.name.split(' (')[0];
    phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
  });

  return Object.keys(phraseCounts).map((phrase) => ({
    id: phrase,
    label: phrase,
    value: phraseCounts[phrase],
  }));
};

const CharacterContent: React.FC<{ character: any }> = ({ character }) => {
  const [data, setData] = useState<{ id: string, label: string, value: number }[]>([]);

  useEffect(() => {
    if (character.comics?.items) {
      const phrases = getComicPhrases(character.comics.items);
      setData(phrases);
    }
  }, [character]);

  return (
    <div className="character-details__content">
      <div className="character-details__image-and-chart">
        <div className="character-details__image-container">
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="character-details__image"
          />
        </div>
        <div className="character-details__chart-container">
          {data.length > 0 ? (
            <ResponsivePie
              data={data}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              enableArcLabels={true}
              enableArcLinkLabels={false}
              isInteractive={true}
              legends={[
                {
                  anchor: 'bottom-left',
                  direction: 'column',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 4,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          ) : (
            <p>No data available for the chart.</p>
          )}
        </div>
      </div>
      <div className="character-details__info">
        <h2 className="character-details__name">{character.name}</h2>
        <p className="character-details__description">
          {character.description || 'No description available.'}
        </p>
        <CharacterList title="Comics" items={character.comics?.items} />
        <CharacterList title="Series" items={character.series?.items} />
      </div>
    </div>
  );
};

const CharacterList: React.FC<{ title: string; items: any[] }> = ({ title, items }) => (
  <>
    <h3 className="character-details__list-heading">{title}:</h3>
    <ul className="character-details__list">
      {items?.map((item) => (
        <li key={item.resourceURI} className="character-details__list-item">
          {item.name}
        </li>
      ))}
    </ul>
  </>
);

export default CharacterDetails;
