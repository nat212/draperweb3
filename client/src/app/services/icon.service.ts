import { Injectable } from '@angular/core';
import * as bsIcons from 'src/assets/bs-icons.json';

export interface IBsIcon {
  [key: string]: {
    title: string;
    categories: string[];
    tags: string[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  public bsIcons: IBsIcon = bsIcons;

  constructor() {}
}
