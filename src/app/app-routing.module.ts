import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { NavComponent } from './nav/nav.component'
import { StatusComponent } from './status/status.component'
import { CartComponent } from './cart/cart.component'
import { SampleFormComponent } from './sample-form/sample-form.component'
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component'
import { AppComponent } from './app.component'
import { FeedComponent } from './feed/feed.component'
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component'
import { TestComponent } from './test/test.component'
import {
    CanExitGuard,
    AuthenticationService,
} from './services/authentication.service'
import { WaitlistComponent } from './waitlist/waitlist.component'
import { ProfileComponent } from './profile/profile.component'
import { BasicAuthGuard } from './guards/basic-auth.guard'
import { InLocalGuard } from './guards/in-local.guard'
import { CreateNewAccommodationComponent } from './dialogs/create-new-accommodation/create-new-accommodation.component'
import { PublicProfileComponent } from './public-profile/public-profile.component'
import { SalesFeedComponent } from './sales-feed/sales-feed.component'
import { AllPpasComponent } from './all-ppas/all-ppas.component'
import { MessagesComponent } from './messages/messages.component'
import { ProfilePageResolver } from './resolvers/profile-page.resolver'
import { MessagesResolver } from './resolvers/messages.resolver'
import { SearchPageComponent } from './search-page/search-page.component'

const routes: Routes = [
    {
        path: '',
        title: 'Welcome! Join our wait list.',
        component: WaitlistComponent,
    },
    {
        path: 'waitlist',
        title: 'Welcome! Join our wait list.',
        component: WaitlistComponent,
    },
    // TODO: create a holder component, and use nav and router there. So we can use nav in other places.
    {
        path: '',
        component: NavComponent,
        canActivate: [BasicAuthGuard],
        children: [
            {
                path: 'home',
                title: 'Your feed',
                component: FeedComponent,
            },
            {
                path: 'houses',
                title: 'Your feed',
                component: FeedComponent,
            },
            {
                path: 'sales',
                title: 'Your feed',
                component: SalesFeedComponent,
            },
            {
                path: 'profile',
                title: 'Profile',
                component: ProfileComponent,
                resolve: {
                    res: ProfilePageResolver,
                },
            },
            {
                path: 'messages',
                title: 'Messages',
                component: MessagesComponent,
                resolve: {
                    res: MessagesResolver,
                },
            },
            {
                path: 'dashboard',
                title: 'Dashboard',
                component: AgentDashboardComponent,
                canActivate: [AuthenticationService],
                canDeactivate: [CanExitGuard],
            },
            {
                path: 'test',
                title: 'This is a test component',
                component: TestComponent,
                canActivate: [InLocalGuard],
                children: [
                    // {
                    //     path: 'new-accommodation',
                    //     title: 'Testing new accommodation dialog',
                    //     component: CreateNewAccommodationComponent,
                    // },
                ],
            },
        ],
    },
    {
        path: 'ppa',
        title: 'PPAs',
        component: AllPpasComponent,
    },
    {
        path: 'ppas',
        title: 'PPAs',
        component: AllPpasComponent,
        // TODO: they won't be able to comment or leave a review if not signed in.
    },
    {
        path: 'search',
        title: 'Search', //  items and PPAs
        component: SearchPageComponent,
        // TODO: they won't be able to comment or leave a review if not signed in.
    },
    {
        path: 'status',
        title: 'Status',
        component: StatusComponent,
        canActivate: [InLocalGuard],
    },
    {
        path: 'cart',
        title: 'Cart',
        component: CartComponent,
        canActivate: [InLocalGuard],
    },
    {
        path: 'p/:route-id',
        title: 'Hey!',
        component: PublicProfileComponent,
    },

    // put activatedRoute for dashboard, agents much be loggedIN

    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'signup', title: 'Sign up', component: SignupComponent },
    {
        path: 'form',
        title: 'A sample Form Page.',
        component: SampleFormComponent,
        canActivate: [InLocalGuard],
    },
    { path: '**', redirectTo: '' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
