import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AttachmentUploaderComponent } from './components/attachment-uploader/attachment-uploader.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ToastErrorComponent } from './components/toast-error/toast-error.component';
import { HomeComponent } from './pages/home/home.component';
import { BaseComponent } from './pages/base/base.component';

@NgModule({
  declarations: [
    AppComponent,
    AttachmentUploaderComponent,
    LoadingComponent,
    MenuComponent,
    ModalComponent,
    PaginationComponent,
    ToastErrorComponent,
    HomeComponent,
    BaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
