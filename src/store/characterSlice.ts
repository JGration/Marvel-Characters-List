import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCharacters, fetchCharacterDetails } from './characterActions';

interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics?: {
    items: { name: string; resourceURI: string }[];
  };
  series?: {
    items: { name: string; resourceURI: string }[];
  };
}

interface CharactersState {
  characters: Character[];
  characterDetails: Character | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: CharactersState = {
  characters: [],
  characterDetails: null,
  loading: false,
  error: null,
  total: 0,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action: PayloadAction<{ results: Character[], total: number }>) => {
        state.characters = action.payload.results;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCharacterDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacterDetails.fulfilled, (state, action: PayloadAction<Character>) => {
        state.characterDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchCharacterDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default charactersSlice.reducer;
