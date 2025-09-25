import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { ThemeService } from './theme.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ChatbotComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'logs';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.loadUserPreference();
  }
}
