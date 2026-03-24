import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from "./users/usersSlice";
import rolesSlice from "./roles/rolesSlice";
import permissionsSlice from "./permissions/permissionsSlice";
import organizationsSlice from "./organizations/organizationsSlice";
import payersSlice from "./payers/payersSlice";
import casesSlice from "./cases/casesSlice";
import tasksSlice from "./tasks/tasksSlice";
import documentsSlice from "./documents/documentsSlice";
import appeal_draftsSlice from "./appeal_drafts/appeal_draftsSlice";
import notesSlice from "./notes/notesSlice";
import activity_logsSlice from "./activity_logs/activity_logsSlice";
import settingsSlice from "./settings/settingsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

users: usersSlice,
roles: rolesSlice,
permissions: permissionsSlice,
organizations: organizationsSlice,
payers: payersSlice,
cases: casesSlice,
tasks: tasksSlice,
documents: documentsSlice,
appeal_drafts: appeal_draftsSlice,
notes: notesSlice,
activity_logs: activity_logsSlice,
settings: settingsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
