import { ComponentFixture, TestBed } from '@angular/core/testing';
import { miblogPage } from './miblog.page';

describe('miblogPage', () => {
  let component: miblogPage;
  let fixture: ComponentFixture<miblogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(miblogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
