import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Offcanvas} from 'bootstrap';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class AuthenticatedComponent implements AfterViewInit {
  public navLinks = [
    { path: 'dashboard', label: 'Dashboard', icon: 'speedometer2' },
    { path: 'budgets', label: 'Budgets', icon: 'piggy-bank' },
  ];

  private drawer!: Offcanvas;

  @ViewChild('drawer') private drawerEl!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.drawer = new Offcanvas(this.drawerEl.nativeElement);
  }

  public showDrawer(): void {
    this.drawer.show();
  }

  public hideDrawer(): void {
    this.drawer.hide();
  }
}
