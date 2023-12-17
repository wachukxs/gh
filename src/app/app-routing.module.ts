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
import { CreateNewAccommodationComponent } from './create-new-accommodation/create-new-accommodation.component'

const routes: Routes = [
    {
        path: '',
        title: 'Home',
        component: NavComponent,
        children: [
            {
                path: '',
                title: 'Your feed',
                component: FeedComponent,
                canActivate: [BasicAuthGuard],
            },
            { path: 'profile', title: 'Profile', component: ProfileComponent },
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
                ]
            },
        ],
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

    // put activatedRoute for dashboard, agents much be loggedIN

    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'signup', title: 'Sign up', component: SignupComponent },
    {
        path: 'form',
        title: 'A sample Form Page.',
        component: SampleFormComponent,
        canActivate: [InLocalGuard],
    },
    {
        path: '',
        title: 'Welcome! Join our wait list.',
        component: WaitlistComponent,
    },
    { path: '**', redirectTo: '' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
