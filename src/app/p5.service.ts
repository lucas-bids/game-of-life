import { Injectable } from '@angular/core';
import p5 from 'p5'

@Injectable({
  providedIn: 'root'
})
export class P5Service {
  private p5: any;

  constructor() { }

  public init(sketch: (p: any) => void): void {
    this.p5 = new p5(sketch);
  }

  public destroy(): void {
    this.p5.remove();
  }
}
