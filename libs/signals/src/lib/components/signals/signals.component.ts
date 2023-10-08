import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "signals",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./signals.component.html",
  styleUrls: ["./signals.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalsComponent {
  private readonly interval = 1000;

  private intervalId!: number;

  readonly counter = signal<number>(0);

  readonly collection = signal<number[]>([]);

  readonly counterPlusCollectionLength = computed<number>(() => this.counter() + this.collection().length);

  readonly toggleSync = signal<boolean>(true);

  readonly syncValue = computed<string>(() => {
    if(this.toggleSync()) {
      return `updated value ${this.counter()} at ${new Date()}`;
    } else {
      return `updated value ${this.collection()} at ${new Date()}`;
    }
  });

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
    this.toggleSync.update(value => !value);
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
