// TODO: use https://dexie.org/

export interface CorpMemberState {
    time_with_us: string
    service_state: string
    _location: string
    id: number
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
    password?: string // would be better if not here.
    middle_name: string // usually an empty string
    first_name: string
    last_name: string
    want_spa_or_not: null | boolean
    accommodation_or_not: null | string
    public_profile: null | string
    nickname: null | string
    bio: null | string
}

export type PublicCorpMember = Pick<CorpMemberState, 'state_code' | 'nickname' | 'first_name' | 'id'>

export type FeedDataType = SaleType | any // TODO: AccommodationType

export type ChatMessage = { 
    age: string
    created_at: string
    id: number | string
    message: string
    message_from: number
    message_sent: boolean
    message_to: number
    read_by_to: boolean
    room: string
    updated_at: string
    _time_read: string
    FromCorpMember: PublicCorpMember
    ToCorpMember: PublicCorpMember
}

export type AppMessageValue = {
    texts: Array<ChatMessage>
    unread_messages?: number
    initiator_name?: string
    recipient_name?: string // full name | nickname | state_code
    recipient_id?: number
    initiator_id?: number
    room?: string
}

/**
 * Should the map key be the room??? No cause what about new messages? And how would we save drafts?
 * Map keys should be the other participant in the chat?
 * No, room key should be generated from the client device?
 */
export type AppMessages = Map<
    string | number | undefined,
    AppMessageValue
>

export interface AppState {
    corper: CorpMemberState
    feed: Array<FeedDataType>

    /**
     * A Map of strings (state codes), and an object of properties, and the text messages.
     */
    messages: AppMessages
}

export interface PpaModel {
    id: number
    name: string
    type_of_ppa: string
    created_at: string
    updated_at: string
    Locations?: Array<LocationModel>
}

export interface LocationModel {
    type: string
    id: number
    ppa_id: number
    accommodation_id: null | number
    directions: null | number
    address: string
    state_lga_id: number
    state_id: number
    corp_member_id: null | number
    created_at: string
    updated_at: string
    CorpMemberId: null | number
}

export interface MediaType {
    id: number
    url: string
    sale_id: number
    updated_at: string
    created_at: string
}

export interface SaleType {
    _price: string // parsable to number
    _age: string
    last_updated_age: string
    _type: 'sale'
    id: number
    corp_member_id: number
    text: string
    item_name: string
    price: number
    Media: Array<MediaType>
    updated_at: string
    created_at: string

    CorpMember?: {
        first_name: string
        nickname: null | string
        service_state: string
        state_code: string
        _location: string
        id: number
    }
}

export const initialCorpMemberState: CorpMemberState = {
    time_with_us: '',
    service_state: '',
    _location: '',
    id: 0, // 0 since it's initial state
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
    password: undefined, // would be better if not here.
    middle_name: '', // usually an empty string
    first_name: '',
    last_name: '',
    want_spa_or_not: null,
    accommodation_or_not: null,
    public_profile: null,
    nickname: null,
    bio: null,
}

const testData = [{}, {}, {}, {}].fill(
    {
        _price: '423,244',
        _age: 'a few seconds ago',
        last_updated_age: 'a few seconds ago',
        _type: 'sale',
        id: 5,
        corp_member_id: 2,
        text: 'Blueyuyy',
        item_name: 'Hello',
        price: 423244,
        Media: [
            {
                id: 4,
                url: 'https://chuks.name.ng/chuks.name.ng/corpers_ng_data/f5287e2ed12d19cb25deeadc9b014e9abe74c987.png',
                sale_id: 5,
                updated_at: '2024-05-03T07:14:32.103Z',
                created_at: '2024-05-03T07:14:32.103Z',
            },
            {
                id: 5,
                url: 'https://chuks.name.ng/chuks.name.ng/corpers_ng_data/89e1e5d3ae0fe38a08e1203d306652a479131730.png',
                sale_id: 5,
                updated_at: '2024-05-03T07:14:32.104Z',
                created_at: '2024-05-03T07:14:32.104Z',
            },
        ],
        updated_at: '2024-05-03T07:14:31.978Z',
        created_at: '2024-05-03T07:14:31.978Z',
    },
    0,
    4,
)

export const initialState: AppState = {
    corper: initialCorpMemberState,
    feed: testData ?? [],
    messages: new Map(),
}
