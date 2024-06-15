import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateblogPage } from './update-blog.page';

describe('UpdateblogPage', () => {
  let component: UpdateblogPage;
  let fixture: ComponentFixture<UpdateblogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateblogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
