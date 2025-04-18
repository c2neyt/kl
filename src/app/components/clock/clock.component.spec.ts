import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ClockComponent } from './clock.component';

describe('ClockComponent', () => {
  let component: ClockComponent;
  let fixture: ComponentFixture<ClockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClockComponent]
    });
    fixture = TestBed.createComponent(ClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update time properly', fakeAsync(() => {
    const getCurrentTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const formattedHours = hours < 10 ? '0' + hours : hours.toString();
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
      const formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    // Comprobar que el tiempo se actualiza correctamente llamando a updateTime
    component.updateTime();
    expect(component.strTime).toEqual(getCurrentTime());

    // Avanzar el tiempo en 1 segundo
    tick(1000);
    fixture.detectChanges();

    // Comprobar que el tiempo se actualiza correctamente después de 1 segundo
    component.updateTime();
    expect(component.strTime).toEqual(getCurrentTime());
  }));

  it('should update strTime variable properly', () => {
    // Obtener la hora actual
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedHours = hours < 10 ? '0' + hours : hours.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();
    const expectedStrTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    // Llamar a updateTime() y comprobar que strTime se actualiza correctamente
    component.updateTime();
    expect(component.strTime).toEqual(expectedStrTime);
  });

});
