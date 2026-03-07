import { Component, OnInit, OnDestroy } from '@angular/core';
import { P5Service } from './p5.service';
import { sketch } from './sketch';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-angular-app';

  constructor(private p5Service: P5Service) { }

  ngOnInit() {
    this.p5Service.init(sketch);
  }

  ngOnDestroy() {
    this.p5Service.destroy();
  }
}
