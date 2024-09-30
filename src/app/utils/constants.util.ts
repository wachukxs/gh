// TODO: all routes should be pre-fixed with /api/v1
export enum URLPaths {
    test = '/test',
    joinWaitList = '/join-waitlist',
    createNewAccommodationPost = '/accommodations',
    createNewSalePost = '/sale',
    corpMemberSignUp = '/signup',
    corpMemberLogIn = '/login',

    createNewPPA = '/ppa',
    getAllPPAs = '/ppas',
    searchPPAs = '/ppas/search',

    getAllItems = '/all-items',

    getAllBookmarkedItems = '/profile/bookmarks',
    getAllLikedItems = '/profile/likes',
    getAllPostedItems = '/profile/posts',

    createNewPpaReview = '/ppa/review',

    corpMemberProfileUpdate = '/profile',
    corpMemberProfileBioUpdate = '/profile/bio',
    corpMemberProfileServiceDetailsUpdate = '/profile/service-details',
    corpMemberProfilePpaDetailsUpdate = '/profile/ppa-details',
    corpMemberProfileOtherDetailsUpdate = '/profile/other-details',
    corpMemberProfilePhotoUpdate = '/profile/profile-photo',

    getNgStates = '/ng-states',
    getNgStateAndLGAs = '/ng-state-and-lgas',
    getNgStateLGAs = '/ng-states/:state_id/lgas',

    sayHi = '/hi',

    getAllChats = '/chat',

    saleBookmark = '/sale/bookmark/',
    saleLike = '/sale/like/',
}