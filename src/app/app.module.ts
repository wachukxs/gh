import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MyHammerConfig } from './hammer-js.config';
import { NgModule } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps'
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatChipsModule } from '@angular/material/chips';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavComponent } from './nav/nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdkStepperModule } from '@angular/cdk/stepper'; // not using this yet, don't even know what it's for [// https://material.angular.io/guide/creating-a-custom-stepper-using-the-cdk-stepper] & MatFormFieldModule
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { StatusComponent } from './status/status.component';
import { CartComponent } from './cart/cart.component';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { FeedComponent } from './feed/feed.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponent } from './test/test.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HouseDetailDialogComponent } from './house-detail-dialog/house-detail-dialog.component';
import { ChatsComponent } from './chats/chats.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    AgentDashboardComponent,
    SampleFormComponent,
    NavComponent,
    StatusComponent,
    CartComponent,
    FeedComponent,
    LocationComponent,
    LoginComponent,
    SignupComponent,
    TestComponent,
    HouseDetailDialogComponent,
    ChatsComponent,
    ImageCarouselComponent
  ],
  imports: [
    HammerModule,
    MatTabsModule,
    MatCheckboxModule,
    GoogleMapsModule,
    BrowserModule,
    CdkStepperModule,
    MatStepperModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    ScrollingModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    ClipboardModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
