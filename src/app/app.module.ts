import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HAMMER_LOADER } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NavComponent } from './nav/nav.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { CdkStepperModule } from '@angular/cdk/stepper'; // not using this yet, don't even know what it's for [// https://material.angular.io/guide/creating-a-custom-stepper-using-the-cdk-stepper] & MatFormFieldModule
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'; 
import { StatusComponent } from './status/status.component';
import { CartComponent } from './cart/cart.component';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CanExitGuard, AuthenticationService } from './services/authentication.service';
import { FeedComponent } from './feed/feed.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponent } from './test/test.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { HouseDetailDialogComponent } from './house-detail-dialog/house-detail-dialog.component';
import { ChatsComponent } from './chats/chats.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { PictureCarouselComponent } from './picture-carousel/picture-carousel.component';
import { ExitConfirmationDialogComponent } from './exit-confirmation-dialog/exit-confirmation-dialog.component';
import { WaitlistComponent } from './waitlist/waitlist.component';
import { JoinWaitlistSuccessBottomsheetComponent } from './join-waitlist-success-bottomsheet/join-waitlist-success-bottomsheet.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    ImageCarouselComponent,
    PictureCarouselComponent,
    ExitConfirmationDialogComponent,
    WaitlistComponent,
    JoinWaitlistSuccessBottomsheetComponent,
    ProfileComponent,
    CreatePostComponent
  ],
  imports: [
    MatNativeDateModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatTabsModule,
    MatCheckboxModule,
    BrowserModule,
    CdkStepperModule,
    MatStepperModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    ScrollingModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatCardModule,
    MatBottomSheetModule,
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
    ClipboardModule,
    HammerModule
  ],
  providers: [
    CanExitGuard,
    AuthenticationService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
