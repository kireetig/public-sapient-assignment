import {Action, Reducer} from "redux";

export interface InitialState {
    news: any;
}

export const initialState: InitialState = {
   news: []
};

export interface DispatchAction extends Action {
    payload: Partial<InitialState>;
}

export enum ActionType {
    UpdateNews,
}

export const rootReducer: Reducer<InitialState, DispatchAction> = (state, action) => {
    if (action.type === ActionType.UpdateNews) {
        return {...state, news: action.payload };
    }
    return initialState;
};