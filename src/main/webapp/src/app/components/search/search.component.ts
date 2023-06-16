import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
    trigger('simpleOnClickAnimation', [
      state('normal', style({
        backgroundColor: 'transparent'
      })),
      state('clicked', style({
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      })),
      transition('normal => clicked', [
        animate('200ms')
      ]),
      transition('clicked => normal', [
        animate('200ms')
      ]),
    ])
  ]
})
export class SearchComponent implements OnInit {
  animationState = 'normal';

  constructor(private router: Router) {
  }

  toggleAnimationState() {
    if (this.animationState === 'normal') {
      this.animationState = 'clicked';

      setTimeout(() => {
        this.animationState = 'normal';
      }, 500);
    }
  }

  ngOnInit(): void {
  }

  searchForProducts(userInput: string) {
    this.router.navigateByUrl(`/search/${userInput}`)
  }
}
