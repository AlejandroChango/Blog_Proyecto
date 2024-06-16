import { ComponentFixture, TestBed } from '@angular/core/testing';
import { updatesignupPage } from './updatesignup.page';

describe('updatesignupPage', () => {
  let component: updatesignupPage;
  let fixture: ComponentFixture<updatesignupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(updatesignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
