import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreViewSearchComponent } from './more-view-search.component';

describe('MoreViewSearchComponent', () => {
  let component: MoreViewSearchComponent;
  let fixture: ComponentFixture<MoreViewSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreViewSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreViewSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
