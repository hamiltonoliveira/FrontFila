import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoDocumentoComponent } from './configuracao-documento.component';

describe('ConfiguracaoDocumentoComponent', () => {
  let component: ConfiguracaoDocumentoComponent;
  let fixture: ComponentFixture<ConfiguracaoDocumentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracaoDocumentoComponent]
    });
    fixture = TestBed.createComponent(ConfiguracaoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
