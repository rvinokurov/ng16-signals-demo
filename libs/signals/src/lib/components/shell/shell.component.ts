import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalsComponent } from "../signals/signals.component";

@Component({
  selector: 'ng16-signals-demo-shell',
  standalone: true,
  imports: [CommonModule, SignalsComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {

  private renderCount = 0;

  get rerender() {
    return this.renderCount++;
  }
}
