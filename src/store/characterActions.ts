import { createAsyncThunk } from '@reduxjs/toolkit';
import marvelCharacterList from '../marvelcharacterlist.json';
import axios from 'axios';

const API_URL = 'https://gateway.marvel.com/v1/public/characters';
const API_KEY = import.meta.env.VITE_REACT_APP_MARVEL_PUBLIC_KEY;

interface MarvelApiResponse {
  data: {
    results: any[];
    total: number;
  };
}

interface FetchCharactersParams {
  offset: number;
  limit: number;
  filter?: string;
}

export interface Comic {
  resourceURI: string;
  name: string;
}

export interface Comics {
  available: number;
  collectionURI: string;
  items: Comic[];
  returned: number;
}


interface MarvelCharacterResponse {
  data: {
    results: any[];
  };
}

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ offset, limit, filter = '' }: FetchCharactersParams, { rejectWithValue }) => {
    try {
      const params: any = {
        apikey: API_KEY,
        limit: limit,
        offset: offset,
      };

      if (filter) {
        params.nameStartsWith = filter;
      }

      const response = await axios.get<MarvelApiResponse>(API_URL, { params });

      if (!response.data.data || !Array.isArray(response.data.data.results)) {
        console.error('Invalid API response structure:', response.data);
        return rejectWithValue('Invalid API response structure');
      }

      return {
        results: response.data.data.results,
        total: response.data.data.total
      };
    } catch (error) {
      console.error('Error fetching characters:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Unknown error occurred');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);


export const fetchCharactersLocal = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ offset, limit, filter = '' }: FetchCharactersParams, { rejectWithValue }) => {
    try {
      // Use the local JSON file
      const data = marvelCharacterList as MarvelApiResponse;

      if (!data.data || !Array.isArray(data.data.results)) {
        console.error('Invalid data structure:', data);
        return rejectWithValue('Invalid data structure');
      }
      const filteredResults = filter
        ? data.data.results.filter(character =>
            character.name.toLowerCase().startsWith(filter.toLowerCase())
          )
        : data.data.results;

      const totalFiltered = filteredResults.length;

      const startIndex = offset;
      const endIndex = Math.min(offset + limit, totalFiltered);
      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      return {
        results: paginatedResults,
        total: totalFiltered
      };
    } catch (error) {
      console.error('Error fetching characters:', error);
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchCharacterDetails = createAsyncThunk(
  'characters/fetchCharacterDetails',
  async (characterId: number, { rejectWithValue }) => {
    try {
      // Check if we're using local data
      const usingLocalData = JSON.parse(localStorage.getItem('useLocalData') || 'false');

      if (usingLocalData) {
        const data = marvelCharacterList as MarvelApiResponse;

        if (!data.data || !Array.isArray(data.data.results)) {
          console.error('Invalid data structure:', data);
          return rejectWithValue('Invalid data structure');
        }

        const character = data.data.results.find(character => character.id === characterId);

        if (!character) {
          console.error('Character not found:', characterId);
          return rejectWithValue('Character not found');
        }

        return character;
      } else {
        const response = await axios.get<MarvelCharacterResponse>(`${API_URL}/${characterId}`, {
          params: {
            apikey: API_KEY,
          },
        });

        if (!response.data.data || !Array.isArray(response.data.data.results)) {
          console.error('Invalid API response structure:', response.data);
          return rejectWithValue('Invalid API response structure');
        }

        return response.data.data.results[0];
      }
    } catch (error) {
      console.error('Error fetching character details:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Unknown error occurred');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);