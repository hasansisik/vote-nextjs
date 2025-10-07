import { createReducer } from "@reduxjs/toolkit";
import {
  createTest,
  getAllTests,
  getSingleTest,
  updateTest,
  deleteTest,
  resetTestVotes,
  getTrendTests,
  getPopularTests,
  getTestsByCategorySlug,
  getUserVotedTests,
  voteOnTest,
  getTestResults,
  startVoteSession,
  getVoteSession,
  voteOnOption,
  getTestResultsWithStats,
  getUserVoteSessions,
  deleteVoteSession,
  getGlobalStats,
  clearTestError
} from "../actions/testActions";

interface TestState {
  tests: any[];
  allTests: any[];
  singleTest: any;
  trendTests: any[];
  popularTests: any[];
  categoryTests: any[];
  categoryInfo: any;
  categoryPagination: any;
  testsLoading: boolean;
  trendTestsLoading: boolean;
  popularTestsLoading: boolean;
  categoryTestsLoading: boolean;
  testsError: string | null;
  currentVoteSession: any;
  voteSessionLoading: boolean;
  voteSessionError: string | null;
  testResultsWithStats: any;
  userVoteSessions: any[];
  userVoteSessionsLoading: boolean;
  userVoteSessionsError: string | null;
  userVotedTests: any[];
  userVotedTestsLoading: boolean;
  userVotedTestsError: string | null;
  testResults: any;
  globalStats: any;
  globalStatsLoading: boolean;
  globalStatsError: string | null;
  message: string | null;
}

const initialState: TestState = {
  tests: [],
  allTests: [],
  singleTest: null,
  trendTests: [],
  popularTests: [],
  categoryTests: [],
  categoryInfo: null,
  categoryPagination: null,
  testsLoading: false,
  trendTestsLoading: false,
  popularTestsLoading: false,
  categoryTestsLoading: false,
  testsError: null,
  currentVoteSession: null,
  voteSessionLoading: false,
  voteSessionError: null,
  testResultsWithStats: null,
  userVoteSessions: [],
  userVoteSessionsLoading: false,
  userVoteSessionsError: null,
  userVotedTests: [],
  userVotedTestsLoading: false,
  userVotedTestsError: null,
  testResults: null,
  globalStats: null,
  globalStatsLoading: false,
  globalStatsError: null,
  message: null,
};

export const testReducer = createReducer(initialState, (builder) => {
  builder
    // Create Test
    .addCase(createTest.pending, (state) => {
      state.testsLoading = true;
      state.testsError = null;
      state.message = null;
    })
    .addCase(createTest.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.allTests.unshift(action.payload.test);
      state.message = action.payload.message;
      state.testsError = null;
    })
    .addCase(createTest.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
      state.message = null;
    })
    // Get All Tests
    .addCase(getAllTests.pending, (state) => {
      state.testsLoading = true;
    })
    .addCase(getAllTests.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.allTests = action.payload.tests;
      state.tests = action.payload.tests;
    })
    .addCase(getAllTests.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get Single Test
    .addCase(getSingleTest.pending, (state) => {
      state.testsLoading = true;
    })
    .addCase(getSingleTest.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.singleTest = action.payload.test;
    })
    .addCase(getSingleTest.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
    })
    // Update Test
    .addCase(updateTest.pending, (state) => {
      state.testsLoading = true;
      state.testsError = null;
      state.message = null;
    })
    .addCase(updateTest.fulfilled, (state, action) => {
      state.testsLoading = false;
      const allIndex = state.allTests.findIndex(test => test._id === action.payload.test._id);
      if (allIndex !== -1) {
        state.allTests[allIndex] = action.payload.test;
      }
      state.message = action.payload.message;
      state.testsError = null;
    })
    .addCase(updateTest.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
      state.message = null;
    })
    // Delete Test
    .addCase(deleteTest.pending, (state) => {
      state.testsLoading = true;
      state.testsError = null;
      state.message = null;
    })
    .addCase(deleteTest.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.allTests = state.allTests.filter(test => test._id !== action.payload.id);
      state.message = action.payload.message;
      state.testsError = null;
    })
    .addCase(deleteTest.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
      state.message = null;
    })
    // Reset Test Votes
    .addCase(resetTestVotes.pending, (state) => {
      state.testsLoading = true;
    })
    .addCase(resetTestVotes.fulfilled, (state, action) => {
      state.testsLoading = false;
      const allIndex = state.allTests.findIndex(test => test._id === action.payload.test._id);
      if (allIndex !== -1) {
        state.allTests[allIndex] = action.payload.test;
      }
      state.message = action.payload.message;
    })
    .addCase(resetTestVotes.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get Trend Tests
    .addCase(getTrendTests.pending, (state) => {
      state.trendTestsLoading = true;
    })
    .addCase(getTrendTests.fulfilled, (state, action) => {
      state.trendTestsLoading = false;
      state.trendTests = action.payload.tests;
    })
    .addCase(getTrendTests.rejected, (state, action) => {
      state.trendTestsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get Popular Tests
    .addCase(getPopularTests.pending, (state) => {
      state.popularTestsLoading = true;
    })
    .addCase(getPopularTests.fulfilled, (state, action) => {
      state.popularTestsLoading = false;
      state.popularTests = action.payload.tests;
    })
    .addCase(getPopularTests.rejected, (state, action) => {
      state.popularTestsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get Tests by Category Slug
    .addCase(getTestsByCategorySlug.pending, (state) => {
      state.categoryTestsLoading = true;
    })
    .addCase(getTestsByCategorySlug.fulfilled, (state, action) => {
      state.categoryTestsLoading = false;
      state.categoryTests = action.payload.tests;
      state.categoryInfo = action.payload.category;
      // Store pagination info
      if (action.payload.pagination) {
        state.categoryPagination = action.payload.pagination;
      }
    })
    .addCase(getTestsByCategorySlug.rejected, (state, action) => {
      state.categoryTestsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get User Voted Tests
    .addCase(getUserVotedTests.pending, (state) => {
      state.userVotedTestsLoading = true;
    })
    .addCase(getUserVotedTests.fulfilled, (state, action) => {
      state.userVotedTestsLoading = false;
      state.userVotedTests = action.payload.votedTests;
    })
    .addCase(getUserVotedTests.rejected, (state, action) => {
      state.userVotedTestsLoading = false;
      state.userVotedTestsError = action.payload as string;
    })
    // Vote on Test
    .addCase(voteOnTest.pending, (state) => {
      state.testsLoading = true;
    })
    .addCase(voteOnTest.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.message = action.payload.message;
    })
    .addCase(voteOnTest.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get Test Results
    .addCase(getTestResults.pending, (state) => {
      state.testsLoading = true;
    })
    .addCase(getTestResults.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.testResults = action.payload;
    })
    .addCase(getTestResults.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
    })
    // Start Vote Session
    .addCase(startVoteSession.pending, (state) => {
      state.voteSessionLoading = true;
      state.voteSessionError = null;
    })
    .addCase(startVoteSession.fulfilled, (state, action) => {
      state.voteSessionLoading = false;
      state.currentVoteSession = action.payload.session;
      state.voteSessionError = null;
    })
    .addCase(startVoteSession.rejected, (state, action) => {
      state.voteSessionLoading = false;
      state.voteSessionError = action.payload as string;
    })
    // Get Vote Session
    .addCase(getVoteSession.pending, (state) => {
      state.voteSessionLoading = true;
    })
    .addCase(getVoteSession.fulfilled, (state, action) => {
      state.voteSessionLoading = false;
      state.currentVoteSession = action.payload.session;
    })
    .addCase(getVoteSession.rejected, (state, action) => {
      state.voteSessionLoading = false;
      state.voteSessionError = action.payload as string;
    })
    // Vote on Option
    .addCase(voteOnOption.pending, (state) => {
      state.voteSessionLoading = true;
    })
    .addCase(voteOnOption.fulfilled, (state, action) => {
      state.voteSessionLoading = false;
      state.currentVoteSession = action.payload.session;
      state.message = action.payload.message;
    })
    .addCase(voteOnOption.rejected, (state, action) => {
      state.voteSessionLoading = false;
      state.voteSessionError = action.payload as string;
    })
    // Get Test Results with Stats
    .addCase(getTestResultsWithStats.pending, (state) => {
      state.testsLoading = true;
    })
    .addCase(getTestResultsWithStats.fulfilled, (state, action) => {
      state.testsLoading = false;
      state.testResultsWithStats = action.payload;
    })
    .addCase(getTestResultsWithStats.rejected, (state, action) => {
      state.testsLoading = false;
      state.testsError = action.payload as string;
    })
    // Get User Vote Sessions
    .addCase(getUserVoteSessions.pending, (state) => {
      state.userVoteSessionsLoading = true;
    })
    .addCase(getUserVoteSessions.fulfilled, (state, action) => {
      state.userVoteSessionsLoading = false;
      state.userVoteSessions = action.payload.sessions;
    })
    .addCase(getUserVoteSessions.rejected, (state, action) => {
      state.userVoteSessionsLoading = false;
      state.userVoteSessionsError = action.payload as string;
    })
    // Delete Vote Session
    .addCase(deleteVoteSession.pending, (state) => {
      state.voteSessionLoading = true;
    })
    .addCase(deleteVoteSession.fulfilled, (state, action) => {
      state.voteSessionLoading = false;
      state.userVoteSessions = state.userVoteSessions.filter(
        session => session.sessionId !== action.payload.sessionId
      );
      state.message = action.payload.message;
    })
    .addCase(deleteVoteSession.rejected, (state, action) => {
      state.voteSessionLoading = false;
      state.voteSessionError = action.payload as string;
    })
    // Get Global Stats
    .addCase(getGlobalStats.pending, (state) => {
      state.globalStatsLoading = true;
    })
    .addCase(getGlobalStats.fulfilled, (state, action) => {
      state.globalStatsLoading = false;
      state.globalStats = action.payload.stats;
    })
    .addCase(getGlobalStats.rejected, (state, action) => {
      state.globalStatsLoading = false;
      state.globalStatsError = action.payload as string;
    })
    // Clear Test Error
    .addCase(clearTestError.fulfilled, (state) => {
      state.testsError = null;
      state.voteSessionError = null;
      state.userVoteSessionsError = null;
      state.userVotedTestsError = null;
      state.globalStatsError = null;
      state.message = null;
    });
});

export default testReducer;
