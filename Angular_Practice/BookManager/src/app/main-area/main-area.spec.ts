import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainArea } from './main-area';

describe('MainArea', () => {
  let component: MainArea;
  let fixture: ComponentFixture<MainArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainArea],
    }).compileComponents();

    fixture = TestBed.createComponent(MainArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
