import { TuiRootModule } from "@taiga-ui/core";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [ RouterModule, TuiRootModule],
  selector: 'ng16-signals-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'signals-demo';
}
