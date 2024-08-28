import { createSlice } from '@reduxjs/toolkit';


const initialUserInfoState = {
  
  isLoggedIn: false,
  avatar :"",
  movieBookmarks: [],
  tvseriesBookmarks: [],
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: initialUserInfoState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },

    setMovieBookmarks: (state, action) => {
      if (Array.isArray(action.payload)) {
        // Adding new bookmarks
        const newBookmarks = action.payload.filter(newBookmark =>
          !state.movieBookmarks.some(existingBookmark =>
            existingBookmark.details.id === newBookmark.details.id
          )
        );
        state.movieBookmarks = [...state.movieBookmarks, ...newBookmarks];
      } else if (typeof action.payload === 'object' && action.payload.action) {
        // Handle individual add/remove actions
        if (action.payload.action === 'add') {
          if (!state.movieBookmarks.some(bookmark => bookmark.details.id === action.payload.details.id)) {
            state.movieBookmarks.push({
              mediaType: action.payload.mediaType,
              details: action.payload.details
            });
          }
        } else if (action.payload.action === 'remove') {
          state.movieBookmarks = state.movieBookmarks.filter(
            bookmark => bookmark.details.id !== action.payload.details.id
          );
        }
      }
    },
    
    setTvseriesBookmarks: (state, action) => {
      if (Array.isArray(action.payload)) {
        // Adding new bookmarks
        const newBookmarks = action.payload.filter(newBookmark =>
          !state.tvseriesBookmarks.some(existingBookmark =>
            existingBookmark.details.id === newBookmark.details.id
          )
        );
        state.tvseriesBookmarks = [...state.tvseriesBookmarks, ...newBookmarks];
      } else if (typeof action.payload === 'object' && action.payload.action) {
        // Handle individual add/remove actions
        if (action.payload.action === 'add') {
          if (!state.tvseriesBookmarks.some(bookmark => bookmark.details.id === action.payload.details.id)) {
            state.tvseriesBookmarks.push({
              mediaType: action.payload.mediaType,
              details: action.payload.details
            });
          }
        } else if (action.payload.action === 'remove') {
          state.tvseriesBookmarks = state.tvseriesBookmarks.filter(
            bookmark => bookmark.details.id !== action.payload.details.id
          );
        }
      }
    },

    resetUserInfoState(){return initialUserInfoState;}  
  },
});
export const { setIsLoggedIn, setAvatar,setMovieBookmarks,setTvseriesBookmarks,resetUserInfoState} = userInfoSlice.actions;
export default userInfoSlice;