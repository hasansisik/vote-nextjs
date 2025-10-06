import { createReducer } from "@reduxjs/toolkit";
import {
  getAllMenus,
  getActiveMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  updateMenuOrder,
  clearMenuError,
} from "../actions/menuActions";

interface MenuState {
  menus: any[];
  allMenus: any[];
  activeMenus: any[];
  currentMenu: any;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: MenuState = {
  menus: [],
  allMenus: [],
  activeMenus: [],
  currentMenu: null,
  loading: false,
  error: null,
  message: null,
};

export const menuReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Menus
    .addCase(getAllMenus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllMenus.fulfilled, (state, action) => {
      state.loading = false;
      state.allMenus = action.payload.menus;
      state.menus = action.payload.menus;
      state.error = null;
    })
    .addCase(getAllMenus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Active Menus
    .addCase(getActiveMenus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getActiveMenus.fulfilled, (state, action) => {
      state.loading = false;
      state.activeMenus = action.payload.menus;
      state.error = null;
    })
    .addCase(getActiveMenus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Single Menu
    .addCase(getMenu.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getMenu.fulfilled, (state, action) => {
      state.loading = false;
      state.currentMenu = action.payload.menu;
      state.error = null;
    })
    .addCase(getMenu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Menu
    .addCase(createMenu.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(createMenu.fulfilled, (state, action) => {
      state.loading = false;
      state.allMenus.unshift(action.payload.menu);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createMenu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Update Menu
    .addCase(updateMenu.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(updateMenu.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.allMenus.findIndex(menu => menu._id === action.payload.menu._id);
      if (index !== -1) {
        state.allMenus[index] = action.payload.menu;
      }
      // Update in activeMenus if it exists there
      const activeIndex = state.activeMenus.findIndex(menu => menu._id === action.payload.menu._id);
      if (activeIndex !== -1) {
        state.activeMenus[activeIndex] = action.payload.menu;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateMenu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Delete Menu
    .addCase(deleteMenu.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(deleteMenu.fulfilled, (state, action) => {
      state.loading = false;
      state.allMenus = state.allMenus.filter(menu => menu._id !== action.payload.id);
      state.activeMenus = state.activeMenus.filter(menu => menu._id !== action.payload.id);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteMenu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Update Menu Order
    .addCase(updateMenuOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateMenuOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateMenuOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Clear Menu Error
    .addCase(clearMenuError.fulfilled, (state) => {
      state.error = null;
      state.message = null;
    });
});

export default menuReducer;
