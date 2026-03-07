import { Injectable, NgZone } from '@angular/core';
import p5 from 'p5'

@Injectable({
  providedIn: 'root'
})
export class P5Service {
  private p5: any;
  private visibilityHandler?: () => void;

  constructor(private ngZone: NgZone) { }

  public init(sketch: (p: any) => void): void {
    if (this.p5) {
      this.destroy();
    }

    this.ngZone.runOutsideAngular(() => {
      this.p5 = new p5(sketch);
    });

    this.visibilityHandler = () => {
      if (!this.p5) return;
      if (document.hidden) {
        this.p5.noLoop();
        return;
      }
      const paused = (this.p5 as any).__paused === true;
      if (!paused) this.p5.loop();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  public destroy(): void {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = undefined;
    }
    if (this.p5) {
      this.p5.remove();
      this.p5 = undefined;
    }
  }
}
