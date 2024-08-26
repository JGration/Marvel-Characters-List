import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import MD5 from 'md5';

const BASE_URL = '/api/v1/public';
const PUBLIC_KEY = import.meta.env.VITE_REACT_APP_MARVEL_PUBLIC_KEY || '';
const PRIVATE_KEY = import.meta.env.VITE_REACT_APP_MARVEL_PRIVATE_KEY || '';

const getAuthParams = () => {
  const ts = new Date().getTime();
  const hash = MD5(`${ts}${PRIVATE_KEY}${PUBLIC_KEY}`);
  return `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
};

const fetchWithTimeout = async (url: string, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    clearTimeout(id);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }

    throw new Error('An unknown error occurred');
  }
};

export const fetchCharacters = async (offset: number, limit: number) => {
  try {
    const url = `${BASE_URL}/characters?${getAuthParams()}&offset=${offset}&limit=${limit}`;
    
    console.log('Marvel API URL:', url);
    console.log('Public Key:', PUBLIC_KEY);
    console.log('Private Key:', PRIVATE_KEY);

    return await fetchWithTimeout(url);
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw new Error('Failed to fetch characters');
  }
};


export const fetchCharacterDetails = createAsyncThunk(
  'characters/fetchCharacterDetails',
  async (characterId: number, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/characters/${characterId}?${getAuthParams()}`;
      const response = await axios.get(url);

      if (!response.data.data || !response.data.data.results || response.data.data.results.length === 0) {
        console.error('Invalid API response structure:', response.data);
        return rejectWithValue('Character not found');
      }

      return response.data.data.results[0];
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
