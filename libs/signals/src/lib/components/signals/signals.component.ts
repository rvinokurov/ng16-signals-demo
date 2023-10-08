import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule, TuiToggleModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'signals',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiButtonModule, TuiToggleModule, ReactiveFormsModule],
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsComponent {
  private readonly interval = 1000;

  private intervalId!: number;

  readonly counter = signal<number>(0);

  readonly collection = signal<number[]>([]);

  readonly counterPlusCollectionLength = computed<number>(
    () => this.counter() + this.collection().length
  );

  syncToggleControl = new FormControl<boolean>(true);

  toggleSync = toSignal(this.syncToggleControl.valueChanges, {
     initialValue: true,
  });

  countFromEffect = '';

  toggleSyncFromEffect = '';

  syncWithUntracked = '';

  syncWithUntrackedFn = '';

  counterCleanUp = 0;

  readonly syncValue = computed<string>(() => {
    if (this.toggleSync()) {
      return `updated value ${this.counter()} at ${Date.now()}`;
    } else {
      return `updated value ${this.collection()} at ${Date.now()}`;
    }
  });

  constructor() {
    effect(() => {
      this.countFromEffect = `updated value ${this.counter()} at ${Date.now()}`;
    });

    effect(() => {
      if (this.toggleSync()) {
        this.toggleSyncFromEffect = `updated value ${this.counter()} at ${Date.now()}`;
      } else {
        this.toggleSyncFromEffect = `updated value ${this.collection()} at ${Date.now()}`;
      }
    });

    effect(() => {
      this.countFromEffect = `updated value ${this.counter()} at ${Date.now()}`;
    });

    effect(() => {
      this.syncWithUntracked = `updated value ${this.counter()} and ${untracked(
        this.collection
      )} at ${Date.now()}`;
    });

    effect(() => {
      this.syncWithUntrackedFn = `updated value ${this.counter()}`;

      untracked(() => {
        this.syncWithUntrackedFn += ` and ${untracked(
          this.collection
        )}`;
      });

      this.syncWithUntrackedFn += ` at ${Date.now()}`;
    });

    effect((onCleanup) => {
      this.counter();

      onCleanup(() => {
        this.counterCleanUp++;
      });
    });
  }

  update() {
    this.counter.update((value) => value + 1);
  }

  addToCollection() {
    this.collection.mutate((value) => {
      value.push(value.length);
    });
  }

  reset() {
    this.counter.set(0);
  }

  switchSync() {
    this.syncToggleControl.setValue(!this.syncToggleControl.value);
  }

  increaseByInterval() {
    this.intervalId = setInterval(() => {
      this.update();
    }, this.interval);
  }

  clearInterval() {
    clearInterval(this.intervalId);
  }
}
