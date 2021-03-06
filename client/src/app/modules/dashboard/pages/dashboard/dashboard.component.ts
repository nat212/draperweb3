import { Component } from '@angular/core';
import { InstallService } from '../../../../services/install.service';
import { UpdateService } from '../../../../services/update.service';
import { Observable } from 'rxjs';

interface IShortcut {
  icon: string;
  name: string;
  url: string;
  alt: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public ecosystemShortcuts: IShortcut[] = [
    {
      name: 'Draper Mail',
      icon: 'assets/logos/roundcube.svg',
      url: 'https://mail.draper.net.za',
      alt: 'Roundcube Logo',
    },
    {
      name: 'Draper Cloud',
      icon: 'assets/logos/nextcloud.svg',
      url: 'https://cloud.draper.net.za',
      alt: 'Nextcloud Logo',
    },
    {
      name: 'Draper Admin',
      icon: 'assets/icons/logo.svg',
      url: 'https://admin.draper.net.za',
      alt: 'Draper Logo',
    },
  ];

  public mediaShortcuts: IShortcut[] = [
    {
      name: 'Sonarr (Series)',
      icon: 'assets/logos/sonarr.svg',
      url: 'http://192.168.0.100:8989',
      alt: 'Sonarr Logo',
    },
    {
      name: 'Radarr (Movies)',
      icon: 'assets/logos/radarr.svg',
      url: 'http://192.168.0.100:7878',
      alt: 'Radarr Logo',
    },
    {
      name: 'Lidarr (Music)',
      icon: 'assets/logos/lidarr.png',
      url: 'http://192.168.0.100:8686',
      alt: 'Lidarr Logo',
    },
  ];

  constructor(private readonly install: InstallService, private readonly updates: UpdateService) {}

  get installPrompt() {
    return this.install.prompt;
  }

  get versionReady$(): Observable<boolean> {
    return this.updates.versionReady$;
  }

  update() {
    window.location.reload();
  }
}
