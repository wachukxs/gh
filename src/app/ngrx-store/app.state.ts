// TODO: use https://dexie.org/

export interface CorpMemberState {
    timeWithUs: string
    servicestate: string
    _location: string
    id: number
    travel_from_city: null | string
    travel_from_state: null | string
    accommodation_location: null | string
    region_street: null | string
    city_town: null | string
    email: string
    lga: null | string
    stream: null | string
    createdAt: string
    batch: null | string
    statecode: string
    updatedAt: string
    mediaId: null | number // why?
    ppaId: null | number
    password: string // would be better if not here.
    middlename: string // usually an empty string
    firstname: string
    lastname: string
    wantspaornot: null | string
    accommodationornot: null | string
    public_profile: null | string
    nickname: null | string
    bio: null | string
}

export interface AppState {
    corper: CorpMemberState
}

export let initialState: AppState = {
    corper: {
        timeWithUs: '',
        servicestate: '',
        _location: '',
        id: 0, // set to 0 cause it really should never be, better still -1
        travel_from_city: null,
        travel_from_state: null,
        accommodation_location: null,
        region_street: null,
        city_town: null,
        email: '',
        lga: null,
        stream: null,
        createdAt: '',
        batch: null,
        statecode: '',
        updatedAt: '',
        mediaId: null, // why?
        ppaId: null,
        password: '', // would be better if not here.
        middlename: '', // usually an empty string
        firstname: '',
        lastname: '',
        wantspaornot: null,
        accommodationornot: null,
        public_profile: null,
        nickname: null,
        bio: null,
    },
}

if (localStorage.getItem('online-corper')) {
    let savedSessionData = JSON.parse(
        new String(localStorage.getItem('online-corper')).toString(),
    )

    initialState = {
        ...savedSessionData,
    }
}
