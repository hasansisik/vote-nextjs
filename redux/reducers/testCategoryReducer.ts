import { createReducer } from "@reduxjs/toolkit";
import {
  getAllTestCategories,
  getActiveTestCategories,
  getTestCategory,
  createTestCategory,
  updateTestCategory,
  deleteTestCategory,
  toggleTestCategoryStatus,
  updateTestCategoryOrder,
  clearTestCategoryError,
} from "../actions/testCategoryActions";

interface TestCategoryState {
  categories: any[];
  allCategories: any[];
  activeCategories: any[];
  currentCategory: any;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: TestCategoryState = {
  categories: [],
  allCategories: [],
  activeCategories: [],
  currentCategory: null,
  loading: false,
  error: null,
  message: null,
};

export const testCategoryReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Test Categories
    .addCase(getAllTestCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllTestCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.allCategories = action.payload.categories;
      state.categories = action.payload.categories;
      state.error = null;
    })
    .addCase(getAllTestCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Active Test Categories
    .addCase(getActiveTestCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getActiveTestCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.activeCategories = action.payload.categories;
      state.error = null;
    })
    .addCase(getActiveTestCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Single Test Category
    .addCase(getTestCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getTestCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCategory = action.payload.category;
      state.error = null;
    })
    .addCase(getTestCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Test Category
    .addCase(createTestCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(createTestCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.allCategories.unshift(action.payload.category);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createTestCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Update Test Category
    .addCase(updateTestCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(updateTestCategory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.allCategories.findIndex(category => category._id === action.payload.category._id);
      if (index !== -1) {
        state.allCategories[index] = action.payload.category;
      }
      // Update in activeCategories if it exists there
      const activeIndex = state.activeCategories.findIndex(category => category._id === action.payload.category._id);
      if (activeIndex !== -1) {
        state.activeCategories[activeIndex] = action.payload.category;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateTestCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Delete Test Category
    .addCase(deleteTestCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(deleteTestCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.allCategories = state.allCategories.filter(category => category._id !== action.payload.id);
      state.activeCategories = state.activeCategories.filter(category => category._id !== action.payload.id);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteTestCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Toggle Test Category Status
    .addCase(toggleTestCategoryStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleTestCategoryStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.allCategories.findIndex(category => category._id === action.payload.category._id);
      if (index !== -1) {
        state.allCategories[index] = action.payload.category;
      }
      // Update in activeCategories
      const activeIndex = state.activeCategories.findIndex(category => category._id === action.payload.category._id);
      if (action.payload.category.isActive) {
        // If category is now active, add it to activeCategories if not already there
        if (activeIndex === -1) {
          state.activeCategories.push(action.payload.category);
        } else {
          state.activeCategories[activeIndex] = action.payload.category;
        }
      } else {
        // If category is now inactive, remove it from activeCategories
        if (activeIndex !== -1) {
          state.activeCategories.splice(activeIndex, 1);
        }
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(toggleTestCategoryStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Test Category Order
    .addCase(updateTestCategoryOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTestCategoryOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateTestCategoryOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Clear Test Category Error
    .addCase(clearTestCategoryError.fulfilled, (state) => {
      state.error = null;
      state.message = null;
    });
});

export default testCategoryReducer;
