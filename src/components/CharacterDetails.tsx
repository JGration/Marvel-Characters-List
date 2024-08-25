import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCharacterDetails } from '../services/marvelApi';
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

const CharacterContent: React.FC<{ character: any }> = ({ character }) => (
  <div className="character-details__content">
    <img
      src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
      alt={character.name}
      className="character-details__image"
    />
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