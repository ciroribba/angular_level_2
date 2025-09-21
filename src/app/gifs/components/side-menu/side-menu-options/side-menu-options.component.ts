import { Component } from '@angular/core';

interface MenuOption {
  label: string;
  sublabel: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [],
  templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {

  menuOptions: MenuOption[] = [
    {
      label: 'Trending',
      sublabel: 'Gifs Populares',
      icon: 'fa-solid fa-chart-line',
      route: '/dashboard/trending',
    },
    {
      label: 'Search',
      sublabel: 'Buscar Gifs',
      icon: 'fa-solid fa-magnifying-glass',
      route: '/dashboard/search',
    },
  ];
 }
