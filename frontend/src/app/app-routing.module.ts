import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosTaggerComponent } from './pos-tagger/pos-tagger.component';


const routes: Routes = [
  { path: 'pos-tagger', component: PosTaggerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
