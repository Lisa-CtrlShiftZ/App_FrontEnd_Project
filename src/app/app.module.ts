import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StorageComponent } from './components/storage/storage.component'; 

@NgModule({
  declarations: [
     
  ],
  imports: [
    BrowserModule,
    AppComponent,
    StorageComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
