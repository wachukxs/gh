import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HAMMER_LOADER } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SwiperModule } from 'swiper/angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavComponent } from './nav/nav.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdkStepperModule } from '@angular/cdk/stepper'; // not using this yet, don't even know what it's for [// https://material.angular.io/guide/creating-a-custom-stepper-using-the-cdk-stepper] & MatFormFieldModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { StatusComponent } from './status/status.component';
import { CartComponent } from './cart/cart.component';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CanExitGuard, AuthenticationService } from './services/authentication.service';
import { FeedComponent } from './feed/feed.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponent } from './test/test.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HouseDetailDialogComponent } from './house-detail-dialog/house-detail-dialog.component';
import { ChatsComponent } from './chats/chats.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { PictureCarouselComponent } from './picture-carousel/picture-carousel.component';
import { ExitConfirmationDialogComponent } from './exit-confirmation-dialog/exit-confirmation-dialog.component';
import { WaitlistComponent } from './waitlist/waitlist.component';
import { JoinWaitlistSuccessBottomsheetComponent } from './join-waitlist-success-bottomsheet/join-waitlist-success-bottomsheet.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateNewAccommodationComponent } from './create-new-accommodation/create-new-accommodation.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CreateNewSaleComponent } from './create-new-sale/create-new-sale.component';
import { JoinWaitlistSuccessDialogComponent } from './dialogs/join-waitlist-success-dialog/join-waitlist-success-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EffectsModule } from '@ngrx/effects';
import { CorpMemberEffects } from './ngrx-store/effects/corp-member.effects';
import { StoreModule } from '@ngrx/store';
import { corpMemberReducer } from './ngrx-store/reducers/corp-member.reducer';
import { BaseInterceptorInterceptor } from './base-interceptor.interceptor';
import { TextFieldModule } from '@angular/cdk/text-field';
import { corpMemberFeatureKey } from './ngrx-store/selectors/corp.selectors';
import { _FEATURE_EFFECTS } from '@ngrx/effects/src/tokens';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { SalesFeedComponent } from './sales-feed/sales-feed.component';
import { AddNewPlaceDialogComponent } from './add-new-place-dialog/add-new-place-dialog.component';

const socketIoConfig: SocketIoConfig = { url: `http://localhost:3051/corp-member`, options: {
  transports: ["websocket", "polling"],
} };

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
    CreateNewAccommodationComponent,
    CreateNewSaleComponent,
    JoinWaitlistSuccessDialogComponent,
    PublicProfileComponent,
    SalesFeedComponent,
    AddNewPlaceDialogComponent
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
    HammerModule,
    MatBadgeModule,
    SwiperModule,
    MatFormFieldModule,
    TextFieldModule,
    EffectsModule.forRoot([CorpMemberEffects]),
    StoreModule.forRoot({[corpMemberFeatureKey]: corpMemberReducer}), // {corper: corpMemberReducer} // {[corpMemberFeatureKey]: corpMemberReducer}
    SocketIoModule.forRoot(socketIoConfig),
  ],
  providers: [
    CanExitGuard,
    AuthenticationService,
    // {
    //   provide: _FEATURE_EFFECTS,
    //   useValue: 
    // },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // https://stackoverflow.com/a/62839144/9259701
    {
      provide: HTTP_INTERCEPTORS, useClass: BaseInterceptorInterceptor, multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
