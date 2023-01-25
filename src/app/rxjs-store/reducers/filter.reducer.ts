import * as filterActions from '../actions/filter.actions';

export function FilterReducer(state: Array<object> = [], action: filterActions.Action) {
    switch (action.type) { // use the payload to filter state.
        case filterActions.BUDGET_RANGE:
            return action.payload;
            break;
        case filterActions.DISABLE_BUDGETS:
            return action.payload;
            break;
        case filterActions.DISABLE_HOUSE_TYPE:
            return action.payload;
            break;
        case filterActions.DISABLE_PROXIMITY:
            return action.payload;
            break;
        case filterActions.HOUSE_TYPE_RANGE:
            return action.payload;
            break;
        case filterActions.PLACES:
            return action.payload;
            break;
        case filterActions.PROXIMITY_RANGE:
            return action.payload;
            break;
        case filterActions.SORT_CLOSEST_PLACES:
            return action.payload;
            break;
        default:
            return state;
            break;
    }
}
