import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { StatusComponent } from './status/status.component';
import { CartComponent } from './cart/cart.component';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponent } from './test/test.component';
import { CanExitGuard, AuthenticationService } from './services/authentication.service';
import { WaitlistComponent } from './waitlist/waitlist.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'home', component: NavComponent,
    children: [
      {
        path: '',
        title: 'Your feed',
        component: FeedComponent
      },
      { path: 'profile', 
      title: 'Profile',
      component: ProfileComponent }
    ]
  },
  { path: 'status', title: 'Status', component: StatusComponent },
  { path: 'cart', title: 'Cart', component: CartComponent },
  { path: 'nav', title: 'Nav?', component: NavComponent },
  
  // put activatedRoute for dashboard, agents much be loggedIN
  { path: 'dashboard', title: 'Dashboard', component: AgentDashboardComponent, canActivate: [AuthenticationService], canDeactivate: [CanExitGuard] },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'signup', title: 'Sign up', component: SignupComponent },
  { path: '', title: 'Welcome! Join our waitlist.', component: WaitlistComponent },
  { path: 'form', title: 'A sample Form Page.', component: SampleFormComponent },
  { path: 'test', title: 'This is a test component', component: TestComponent },
  { path: '**', title: 'You\'re lost!', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
