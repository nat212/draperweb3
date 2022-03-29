import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly titlePrefix = 'DraperWeb';
  private readonly titleSep = ' | ';

  constructor(private readonly title: Title) {}

  public setTitle(title?: string) {
    if (title) {
      this.title.setTitle(`${this.titlePrefix}${this.titleSep}${title}`);
    } else {
      this.title.setTitle(this.titlePrefix);
    }
  }
}
