# Current New corpers.online front-end

## TODOs... well, a lot.
- When you post an item, it doesn't go to the top of the post lists.
- You must post with pictures.
- ~~Display proper error message when you try to login - and acct. is not found; and other scenario - check BE err messages.~~
- Show ellipsis for very long text descriptions
- Placeholder images - and lazy loading images / media
* ~~link to our backend.~~ ✅
* They should invite their friends after joining our waitlist
* Implement [animated icons](https://material.io/design/iconography/animated-icons.html#usage)
* How to use angular [motion design kit](https://material.io/resources/motion-design-kit)
  * https://material.io/resources/tutorials#web
  * https://codelabs.developers.google.com/codelabs/mdc-103-web#0
* [File upload](https://blog.angular-university.io/angular-file-upload/)
* [Infinite Scroll](https://zoaibkhan.com/blog/create-a-fast-infinite-scrolling-list-in-angular/)
  * Not bad [animation](https://zoaibkhan.com/blog/add-spring-animations-to-your-angular-app-with-popmotion/)
* Do cost of living for corpers.online (like [numbeo](https://www.numbeo.com/cost-of-living/)) in various Nigerian states/cities/ and places.
* Use [Transclusion](https://daily-dev-tips.com/posts/angular-10-transclusion-when-and-why-youll-need-it/) in Angular
* How do we really MAP Nigeria - better than the Postal service. Like the APIs [here](https://github.com/public-apis/public-apis?tab=readme-ov-file#tracking).

## Considerations, and things we might want to use
* ~~[HammerJS Directive](http://ryanmullins.github.io/angular-hammer/) as a fallback plan~~
* Use (pan*) events to acheive the drag that is on AirBnB app with images.
* [Google Codelabs](https://codelabs.developers.google.com/)
* Can we use AI to auto give directions
* Implement [these best practices for our scrolling](https://climbtheladder.com/10-angular-cdk-virtual-scroll-best-practices/)
* [Angular Azure Maps - 6 yrs old](https://github.com/acaisoft/angular-azure-maps?tab=readme-ov-file)

## Reference Links
* Using [ngrx](https://inveritasoft.com/blog/angular-using-ngrx-schematics-and-ngrx-entity-to-speed-up-your-startup)
* Using angular's [material design](https://ultimatecourses.com/blog/the-missing-guide-to-angular-material)

## Design sources
* Wait list page
  * [Desktop View](https://dribbble.com/shots/6780267-June-Homes-Wait-List)
* [Material 2 Design Components](https://www.figma.com/community/file/778763161265841481)
* [Material 3 Design Components](https://www.figma.com/community/file/1035203688168086460)
  * [An Inspiration](https://www.figma.com/community/file/1164313362327941158)
* [M2 Resources](https://m2.material.io/resources)

## Questions
* What are we doing with [HammerJS](https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md) ?

## How we're building / should build
* [Loved by our corp members](https://www.figma.com/blog/peter-yangs-10-rules-for-making-products-that-customers-love/)
* [Psychology and UX - NN/g](https://www.nngroup.com/topic/psychology-and-ux/)
* [NN/g Study Guides](https://www.nngroup.com/topic/study-guide/)

## Resources we're using
* [typescript.tv](https://typescript.tv/)
* For our image sliders
    * [keen-slider](https://keen-slider.io/examples)
    * [SwiperJS](https://swiperjs.com/angular) - we're going with this.

## Notes
* This [commit](https://github.com/wachukxs/gh/commit/f435a1222fe57cce3413661fe288754ba9b4dfda) contains designs for [long-house] design.

## We're Using Material Design!

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
