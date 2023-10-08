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
import { fromInteropObservable } from 'rxjs/internal/observable/innerFrom';
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

  // readonly toggleSync = signal<boolean>(true);

  syncToggleControl = new FormControl<boolean>(true);

  toggleSync = toSignal(this.syncToggleControl.valueChanges, {
     initialValue: true,
  });

  countFromEffect = '';

  toggleSyncFromEffect = '';

  syncWithUntracked = '';

  syncWithUntrackedFn = '';

  readonly syncValue = computed<string>(() => {
    if (this.toggleSync()) {
      return `updated value ${this.counter()} at ${new Date()}`;
    } else {
      return `updated value ${this.collection()} at ${new Date()}`;
    }
  });

  constructor() {
    effect(() => {
      this.countFromEffect = `updated value ${this.counter()} at ${new Date()}`;
    });

    effect(() => {
      if (this.toggleSync()) {
        this.toggleSyncFromEffect = `updated value ${this.counter()} at ${new Date()}`;
      } else {
        this.toggleSyncFromEffect = `updated value ${this.collection()} at ${new Date()}`;
      }
    });

    effect(() => {
      this.countFromEffect = `updated value ${this.counter()} at ${new Date()}`;
    });

    effect(() => {
      this.syncWithUntracked = `updated value ${this.counter()} and ${untracked(
        this.collection
      )} at ${new Date()}`;
    });

    effect(() => {
      this.syncWithUntrackedFn = `updated value ${this.counter()} and`;

      untracked(() => {
        this.syncWithUntrackedFn += `and ${untracked(
          this.collection
        )} at ${new Date()}`;
      });

      this.syncWithUntrackedFn += `at ${new Date()}`;
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
    // this.toggleSync.update((value) => !value);
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
