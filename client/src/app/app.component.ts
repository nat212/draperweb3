import { Component } from '@angular/core';
import { UpdateService } from "./services/update.service";
import { InstallService } from "./services/install.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(_update: UpdateService, install: InstallService) {
    install.listenForPrompt();
  }
}
