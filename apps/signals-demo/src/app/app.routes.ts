import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signals',
  },
  {
    path: 'signals',
    loadChildren: () =>
      import('@ng16-signals-demo/signals').then((m) => m.signalsRoutes),
  },
];
