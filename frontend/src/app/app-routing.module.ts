import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaggerComponent } from './tagger/tagger.component';


const routes: Routes = [
  { path: 'tagger', component: TaggerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
