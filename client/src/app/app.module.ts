import { HTTP_INTERCEPTORS } from "@angular/common/http"; // use this
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/user/login/login.component";
import { NavComponent } from "./components/nav/nav.component";
import { FooterComponent } from "./components/footer/footer.component";
import { PostComponent } from "./pages/home/components/post/post.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ProfileComponent } from "./pages/profile/profile.component";
import { SignupComponent } from "./pages/user/signup/signup.component";
import { LandingPageComponent } from "./pages/landingPage/landing-page/landing-page.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatIconModule } from "@angular/material/icon";
import { AuthGuard } from "./auth.guard";
import { EditComponent } from "./pages/profile/edit/edit.component";
import { InfoSectionComponent } from "./pages/profile/info-section/info-section.component";
import { PostsSectionComponent } from "./pages/profile/posts-section/posts-section.component";
import { MatCardModule } from "@angular/material/card";
import { PostCardComponentComponent } from "./pages/home/components/post-card-component/post-card-component.component";
import { HttpRequestInterceptor } from "./HttpRequestInterceptor";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SafePipe } from "./pipes/safe.pipe";
import { ReversePipe } from "./pipes/reverse.pipe";
import { DateAgoPipe } from "./pipes/date-ago.pipe";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { UserProfilePostsSectionComponent } from "./pages/user-profile/user-profile-posts-section/user-profile-posts-section.component";
import { MatSidenavModule, MatListModule } from "@angular/material";
import { ChatComponent } from "./pages/home/chat/chat.component";
import { ChatroomComponent } from "./pages/home/chatroom/chatroom.component";
import { UserService } from "./user.service";
import { WebsocketService } from "./websocket.service";
import {
  FlashMessagesModule,
  FlashMessagesService
} from "angular2-flash-messages/module";
import { HttpModule } from "@angular/http";
import { MainSideComponent } from "./pages/home/components/main-side/main-side.component";
import { FollowingSideComponent } from "./pages/home/components/following-side/following-side.component";
import { FollowersComponent } from './pages/profile/info-section/followers/followers.component';
import { FollowingComponent } from './pages/profile/info-section/following/following.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    FooterComponent,
    PostComponent,
    ProfileComponent,
    SignupComponent,
    LandingPageComponent,
    EditComponent,
    InfoSectionComponent,
    PostsSectionComponent,
    PostCardComponentComponent,
    SafePipe,
    ReversePipe,
    DateAgoPipe,
    UserProfileComponent,
    UserProfilePostsSectionComponent,
    ChatComponent,
    ChatroomComponent,
    MainSideComponent,
    FollowingSideComponent,
    FollowersComponent,
    FollowingComponent
  ],
  imports: [
    MatListModule,
    MatSidenavModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    NgbModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    MatIconModule,
    MatCardModule,
    SweetAlert2Module,
    HttpModule
  ],
  providers: [
    LoginComponent,
    AuthGuard,
    FlashMessagesService,
    UserService,
    AuthGuard,
    WebsocketService,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpRequestInterceptor,
        multi: true
      }
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
