import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeamCreationComponent } from './components/team-creation/team-creation.component';
export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'teamcreation', component: TeamCreationComponent},

];
