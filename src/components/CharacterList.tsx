import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharacters, fetchCharactersLocal } from '../store/characterActions';
import { AppDispatch, RootState } from '../store';
import { CharacterCardProps } from '../types/character';
import './CharacterList.scss';

const CharacterList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { characters, loading, error, total } = useSelector((state: RootState) => state.characters);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [useLocalData, setUseLocalData] = useState(() => 
    JSON.parse(localStorage.getItem('useLocalData') ?? 'false')
  );
  const limit = 20;

  const handleSearch = useCallback(() => setSearch(filter), [filter]);
  const handleClear = useCallback(() => {
    setFilter('');
    setSearch('');
  }, []);

  const toggleDataSource = useCallback(() => {
    setUseLocalData((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem('useLocalData', JSON.stringify(newValue));
      setPage(1);
      setFilter('');
      setSearch('');
      return newValue;
    });
  }, []);

  useEffect(() => {
    if (search !== undefined) {
      const fetchAction = useLocalData ? fetchCharactersLocal : fetchCharacters;
      dispatch(fetchAction({ offset: (page - 1) * limit, limit, filter: search }));
    }
  }, [dispatch, page, search, useLocalData]);

  return (
    <div className="character-list">
      <h1 className="character-list__title">Marvel Characters</h1>

      <div className="character-list__filters">
        <input
          className="character-list__input"
          type="text"
          placeholder="Filter by character name or series"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          disabled={loading}
        />
        <button className="character-list__button" onClick={handleSearch} disabled={loading}>
          <i className="fas fa-search" />
        </button>
        <button className="character-list__button character-list__button--clear" onClick={handleClear} disabled={loading}>
          <i className="fas fa-trash" />
        </button>
        <button className="character-list__button character-list__button--toggle" onClick={toggleDataSource}>
          {useLocalData ? 'Use API Data' : 'Use Local Data'}
        </button>
      </div>

      {useLocalData && (
        <div className="character-list__info">
          This local data only has content for 1 page! But feel free to use it nonetheless.
        </div>
      )}

      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}

      {!loading && !error && (
        <>
          <CharacterGrid characters={characters} />
          <Pagination page={page} setPage={setPage} total={total} limit={limit} />
        </>
      )}
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="character-list__loading">
    <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Loading...
  </div>
);

const ErrorState: React.FC<{ error: unknown }> = ({ error }) => (
  <div className="character-list__text-center text-red-500">
    Error: {JSON.stringify(error)}
  </div>
);

const CharacterGrid: React.FC<{ characters: CharacterCardProps[] }> = ({ characters }) => (
  <div className="character-list__grid-container">
    {characters.map(character => (
      <CharacterCard key={character.id} character={character} />
    ))}
  </div>
);



const CharacterCard: React.FC<{ character: CharacterCardProps }> = ({ character }) => (
  <div className="character-list__character-card">
    <div className="character-list__character-image-container">
      <img
        className="character-list__character-image"
        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
        alt={character.name}
      />
    </div>
    <div className="character-list__character-name-label">{character.name}</div>
    <div className="character-list__character-overlay">
      <h2 className="character-list__character-name">{character.name}</h2>
      <p className="character-list__character-description">
        {character.description || 'No description available.'}
      </p>
      <a className="character-list__character-link" href={`/characters/${character.id}`}>
        View Details
      </a>
    </div>
  </div>
);

const Pagination: React.FC<{
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  limit: number;
}> = ({ page, setPage, total, limit }) => (
  <div className="character-list__pagination">
    <button
      className="character-list__pagination-button"
      onClick={() => setPage(p => Math.max(1, p - 1))}
      disabled={page === 1}
    >
      <i className="fas fa-chevron-left" />
    </button>
    <span>Page {page} of {Math.ceil(total / limit)}</span>
    <button
      className="character-list__pagination-button"
      onClick={() => setPage(p => p + 1)}
      disabled={page >= Math.ceil(total / limit)}
    >
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

export default CharacterList;