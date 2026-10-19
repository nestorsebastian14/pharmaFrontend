import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ClienteForm } from './cliente-form';

describe('ClienteForm', () => {
  let component: ClienteForm;
  let fixture: ComponentFixture<ClienteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
