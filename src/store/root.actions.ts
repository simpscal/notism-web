import { createAction } from '@reduxjs/toolkit';

/**
 * Root-level action to reset all store slices to their initial state.
 * All slices should listen to this action in their extraReducers.
 */
export const resetStore = createAction('root/resetStore');
