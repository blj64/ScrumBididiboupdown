import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamCreationComponent } from "./components/team-creation/team-creation.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TeamCreationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
