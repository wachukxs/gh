// TODO: use https://dexie.org/

export interface CorpMemberState {
    time_with_us: string
    service_state: string
    _location: string
    id?: number
    travel_from_city: null | string
    travel_from_state: null | string
    accommodation_location: null | string
    region_street: null | string
    city_or_town: null | string
    email: string
    lga: null | string
    stream: null | string
    created_at: string
    batch: null | string
    state_code: string
    updated_at: string
    media_id: null | number // why?
    ppa_id: null | number
    password?: null | string // would be better if not here.
    middle_name: string // usually an empty string
    first_name: string
    last_name: string
    want_spa_or_not: null | boolean
    accommodation_or_not: null | string
    public_profile: null | string
    nickname: null | string
    bio: null | string
}

export interface AppState {
    corper: CorpMemberState

    feed: Array<any>

    messages: Array<any>
}

export interface PpaModel {
    "id": Number,
    "name": String,
    "type_of_ppa": String,
    "created_at": String,
    "updated_at": String,
    Locations?: Array<LocationModel>
}

export interface LocationModel {
    "type": string,
    "id": number,
    "ppa_id": number,
    "accommodation_id": null | number,
    "directions": null | number,
    "address": string,
    "state_lga_id": number,
    "state_id": number,
    "corp_member_id": null | number,
    "created_at": string,
    "updated_at": string,
    "CorpMemberId": null | number
}

export const initialCorpMemberState: CorpMemberState = {
    time_with_us: '',
    service_state: '',
    _location: '',
    // id: 0, // set to 0 cause it really should never be, better still -1
    travel_from_city: null,
    travel_from_state: null,
    accommodation_location: null,
    region_street: null,
    city_or_town: null,
    email: '',
    lga: null,
    stream: null,
    created_at: '',
    batch: null,
    state_code: '',
    updated_at: '',
    media_id: null, // why?
    ppa_id: null,
    password: null, // would be better if not here.
    middle_name: '', // usually an empty string
    first_name: '',
    last_name: '',
    want_spa_or_not: null,
    accommodation_or_not: null,
    public_profile: null,
    nickname: null,
    bio: null,
}

export const initialState: AppState = {
    corper: initialCorpMemberState,
    feed: [],
    messages: [],
}