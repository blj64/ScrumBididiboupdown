import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeamCreationComponent } from './components/team-creation/team-creation.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'teamcreation', component: TeamCreationComponent, canActivate: [AuthGuard]},
    {path: 'home', component: HomeComponent},
    {path: '',redirectTo: 'home', pathMatch: 'full'}

];
