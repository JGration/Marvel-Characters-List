import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharacters, fetchCharactersLocal } from '../store/characterActions';
import { AppDispatch, RootState } from '../store';
import './CharacterList.scss';

const CharacterList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { characters, loading, error, total } = useSelector((state: RootState) => state.characters);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [useLocalData, setUseLocalData] = useState(() => {
    const storedData = localStorage.getItem('useLocalData');
    return storedData ? JSON.parse(storedData) : false;
  });
  const limit = 20;

  const handleSearch = () => {
    setSearch(filter);
  };

  const handleClear = () => {
    setFilter('');
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleDataSource = () => {
    const newValue = !useLocalData;
    setUseLocalData(newValue);
    localStorage.setItem('useLocalData', JSON.stringify(newValue));
    setPage(1);
    setFilter('');
    setSearch('');
  };

  useEffect(() => {
    if (search !== undefined) {
      const fetchAction = useLocalData ? fetchCharactersLocal : fetchCharacters;
      dispatch(fetchAction({
        offset: (page - 1) * limit,
        limit,
        filter: search
      }));
    }
  }, [dispatch, page, search, useLocalData]);

  return (
    <div className="character-list">
      <div className="character-list__header">
        <h1 className="character-list__title">Marvel Characters</h1>
      </div>

      <div className="character-list__filters">
        <input
          className="character-list__input"
          type="text"
          placeholder="Filter by character name or series"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="character-list__button"
          onClick={handleSearch}
          disabled={loading}
        >
          <i className="fas fa-search"></i>
        </button>
        <button
          className="character-list__button character-list__button--clear"
          onClick={handleClear}
          disabled={loading}
        >
          <i className="fas fa-trash"></i>
        </button>
        <button
          className="character-list__button character-list__button--toggle"
          onClick={toggleDataSource}
        >
          {useLocalData ? 'Use API Data' : 'Use Local Data'}
        </button>
      </div>

      {loading && (
        <div className="character-list__loading-container">
          Loading...
        </div>
      )}

      {error && (
        <div className="character-list__text-center text-red-500">
          Error: {JSON.stringify(error)}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="character-list__grid-container">
            {characters.map(character => (
              <div key={character.id} className="character-list__character-card">
                <div className="character-list__character-image-container">
                  <img
                    className="character-list__character-image"
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                  />
                </div>
                <div className="character-list__character-name-label">
                  {character.name}
                </div>
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
            ))}
          </div>

          <div className="character-list__pagination">
            <button
              className="character-list__pagination-button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span>
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              className="character-list__pagination-button"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterList;