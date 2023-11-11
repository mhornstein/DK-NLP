import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaggerComponent } from './tagger/tagger.component';
import { HistoryComponent } from './history/history.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tagger', pathMatch: 'full' },
  { path: 'tagger', component: TaggerComponent },
  { path: 'about', component: AboutComponent },
  { path: 'history', component: HistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
