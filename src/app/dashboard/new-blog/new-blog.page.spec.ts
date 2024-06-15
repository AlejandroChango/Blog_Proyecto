import { ComponentFixture, TestBed } from '@angular/core/testing';
import { newblogPage } from './new-blog.page';

describe('newblogPage', () => {
  let component: newblogPage;
  let fixture: ComponentFixture<newblogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(newblogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
