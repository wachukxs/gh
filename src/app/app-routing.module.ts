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

const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'status', component: StatusComponent },
  { path: 'cart', component: CartComponent },
  { path: 'nav', component: NavComponent },
  // put activatedRoute for dashboard, agents much be loggedIN
  { path: 'dashboard', component: AgentDashboardComponent, canActivate: [AuthenticationService], canDeactivate: [CanExitGuard] },
  { path: 'feed', component: FeedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: FeedComponent },
  { path: 'form', component: SampleFormComponent },
  { path: 'test', component: TestComponent },
  { path: '**', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
