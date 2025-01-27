import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StorageComponent } from '.components/storage/storage.component'; // Adjust path if needed

@NgModule({
  declarations: [
    AppComponent,
    StorageComponent // Add your component here
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
