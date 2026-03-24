import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface MainState {
    isFetchingQuery: boolean;
    errorMessage: string;
    smartWidgets: any[];
    gptResponse: string | null;
    aiResponse: any | null;
    isAskingQuestion: boolean;
    isAskingResponse: boolean;
    notify: {
        showNotification: boolean;
        textNotification: string;
        typeNotification: string;
    };
}
const initialState: MainState = {
    isFetchingQuery: false,
    errorMessage: '',
    smartWidgets: [],
    gptResponse: null,
    aiResponse: null,
    isAskingQuestion: false,
    isAskingResponse: false,
    notify: {
        showNotification: false,
        textNotification: '',
        typeNotification: 'warn',
    },
};

const fulfilledNotify = (state, msg, type?: string) => {
    state.notify.textNotification = msg;
    state.notify.typeNotification = type || 'success';
    state.notify.showNotification = true;
};

export const aiPrompt = createAsyncThunk(
    'openai/aiPrompt',
    async (data: any, { rejectWithValue }) => {
        try {
            return await axios.post('/openai/create_widget', data);
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    },
);

export const askGpt = createAsyncThunk(
    'openai/askGpt',
    async (prompt: string, { rejectWithValue }) => {
        try {
            const response = await axios.post('/openai/ask-gpt', { prompt });
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    },
);

export const aiResponse = createAsyncThunk(
    'openai/aiResponse',
    async (payload: { input: Array<{ role: string; content: string }>; options?: Record<string, any> }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/ai/response', payload);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    },
);

export const openAiSlice = createSlice({
    name: 'openAiSlice',
    initialState,
    reducers: {
        resetNotify: (state) => {
            state.notify.showNotification = false;
            state.notify.typeNotification = '';
            state.notify.textNotification = '';
        },
        setErrorNotification: (state, action) => {
            fulfilledNotify(state, action.payload, 'error');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(aiPrompt.pending, (state) => {
            state.isFetchingQuery = true;
        });
        builder.addCase(aiPrompt.fulfilled, (state, action: Record<any, any>) => {
            state.isFetchingQuery = false;
            state.errorMessage = '';
            state.smartWidgets.unshift(action.payload.data);
        });

        builder.addCase(aiPrompt.rejected, (state) => {
            state.errorMessage = 'Something was wrong. Try again';
            state.isFetchingQuery = false;
            state.smartWidgets = null;
        });

        builder.addCase(askGpt.pending, (state) => {
            state.isAskingQuestion = true;
            state.gptResponse = null;
            state.errorMessage = '';
        });
        builder.addCase(askGpt.fulfilled, (state, action) => {
            state.isAskingQuestion = false;
            state.gptResponse = action.payload.data;
            state.errorMessage = '';
        });
        builder.addCase(askGpt.rejected, (state) => {
            state.isAskingQuestion = false;
            state.gptResponse = null;
            state.errorMessage = 'Failed to get response from ChatGPT. Please try again.';
            fulfilledNotify(state, 'Failed to get response from ChatGPT', 'error');
        });

        builder.addCase(aiResponse.pending, (state) => {
            state.isAskingResponse = true;
            state.aiResponse = null;
            state.errorMessage = '';
        });
        builder.addCase(aiResponse.fulfilled, (state, action) => {
            state.isAskingResponse = false;
            state.aiResponse = action.payload;
            state.errorMessage = '';
        });
        builder.addCase(aiResponse.rejected, (state) => {
            state.isAskingResponse = false;
            state.aiResponse = null;
            state.errorMessage = 'Failed to get response from AI proxy. Please try again.';
            fulfilledNotify(state, 'Failed to get response from AI proxy', 'error');
        });
    },
});

// Action creators are generated for each case reducer function
export const { resetNotify, setErrorNotification } = openAiSlice.actions;

export default openAiSlice.reducer;
