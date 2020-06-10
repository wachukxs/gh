export const DISABLE_BUDGETS = 'DISABLE_BUDGETS';
export const BUDGET_RANGE = 'BUDGET_RANGE';
export const DISABLE_HOUSE_TYPE = 'DISABLE_HOUSE_TYPE';
export const HOUSE_TYPE_RANGE = 'HOUSE_TYPE_RANGE';
export const DISABLE_PROXIMITY = 'DISABLE_PROXIMITY';
export const PROXIMITY_RANGE = 'PROXIMITY_RANGE';
export const PLACES = 'PLACES';
export const SORT_CLOSEST_PLACES = 'SORT_CLOSEST_PLACES';

interface NumberRange {
    min: number;
    max: number;
}

export class DisableBudgets {
    readonly type = DISABLE_BUDGETS;
    constructor(public payload: boolean) {}
}

export class BudgetRange {
    readonly type = BUDGET_RANGE;
    constructor(public payload: NumberRange) {}
}

export class DisableHouseType {
    readonly type = DISABLE_HOUSE_TYPE;
    constructor(public payload: boolean) {}
}

export class HouseTypeRange {
    readonly type = HOUSE_TYPE_RANGE;
    constructor(public payload: Array<string>) {}
}

export class DisableProximity {
    readonly type = DISABLE_PROXIMITY;
    constructor(public payload: boolean) {}
}

export class ProximityRange {
    readonly type = PROXIMITY_RANGE;
    constructor(public payload: NumberRange) {}
}

export class Places {
    readonly type = PLACES;
    constructor(public payload: Array<string>) {}
}

export class SortClosestPlaces {
    readonly type = SORT_CLOSEST_PLACES;
    constructor(public payload: number) {}
}

export type Action
    = DisableBudgets
    | BudgetRange
    | DisableHouseType
    | HouseTypeRange
    | DisableProximity
    | ProximityRange
    | Places
    | SortClosestPlaces
    ;
