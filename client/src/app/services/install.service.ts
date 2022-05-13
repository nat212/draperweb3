import { Injectable } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<any>;
}

@Injectable({
  providedIn: 'root'
})
export class InstallService {
  private promptEvent?: BeforeInstallPromptEvent;
  constructor(private readonly update: SwUpdate) { }

  public listenForPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.promptEvent = e as BeforeInstallPromptEvent;
      return false;
    });
  }

  public get prompt(): BeforeInstallPromptEvent | undefined {
    return this.promptEvent;
  }
}
