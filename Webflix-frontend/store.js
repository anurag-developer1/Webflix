import { configureStore } from '@reduxjs/toolkit';
import userInfoSlice from './src/reduxstateslices/userInfoSlice';


const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    
  },
});

export default store;