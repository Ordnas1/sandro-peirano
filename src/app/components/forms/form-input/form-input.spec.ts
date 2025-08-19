import { provideZonelessChangeDetection } from "@angular/core";
import { FormInput } from "./form-input";
import { MockBuilder, MockRender, ngMocks } from "ng-mocks";
import { FormControl, Validators } from "@angular/forms";

describe("FormInput", () => {
  beforeEach(async () => {
    await MockBuilder(FormInput).provide(provideZonelessChangeDetection());
  });

  it("should create", () => {
    const fixture = MockRender(FormInput);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
  it("should display label when provided", () => {
    MockRender(FormInput, { label: "Test Label", name: "test" });

    const label = ngMocks.find('[data-test-id="input-label"]');
    expect(ngMocks.formatText(label)).toBe("Test Label");
  });

  it("should not display label when not provided", () => {
    MockRender(FormInput, { name: "test" });

    expect(() => ngMocks.find('[data-test-id="input-label"]')).toThrow();
  });

  it("should set input attributes correctly", () => {
    MockRender(FormInput, {
      name: "testInput",
      type: "text",
      placeholder: "Enter email",
      minValue: "0",
    });

    const input = ngMocks.find('[data-test-id="input-elem"]');
    expect(input.nativeElement.id).toBe("testInput");
    expect(input.nativeElement.type).toBe("text");
    expect(input.nativeElement.placeholder).toBe("Enter email");
    expect(input.nativeElement.min).toBe("0");
  });

  it("should handle disabled state", () => {
    const fixture = MockRender(FormInput, { name: "test" });
    const component = fixture.point.componentInstance;
    const input = ngMocks.find('[data-test-id="input-elem"]');

    // Test setDisabledState method
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.disabled()).toBe(true);
    expect(input.nativeElement.disabled).toBe(true);
  }); 
  it('should update value signal when writeValue is called', () => {                                                          
    const fixture = MockRender(FormInput, { name: 'test' });                                                                  
    const component = fixture.point.componentInstance;                                                                        
                                                                                                                              
    component.writeValue('test value');                                                                                       
                                                                                                                              
    expect(component.value()).toBe('test value');                                                                             
  });                                                                                                                         
                                                                                                                              
  it('should update disabled signal when setDisabledState is called', () => {                                                 
    const fixture = MockRender(FormInput, { name: 'test' });                                                                  
    const component = fixture.point.componentInstance;                                                                        
                                                                                                                              
    component.setDisabledState(true);                                                                                         
                                                                                                                              
    expect(component.disabled()).toBe(true);                                                                                  
  });

  it('should call onTouched and set touched when onBlur is triggered', () => {                                                
    const fixture = MockRender(FormInput, { name: 'test' });                                                                  
    const component = fixture.point.componentInstance;                                                                        
    const onTouchedSpy = jest.fn();                                                                                           
                                                                                                                              
    component.registerOnTouched(onTouchedSpy);                                                                                
                                                                                                                              
    component.onBlur();                                                                                                       
                                                                                                                              
    expect(component.touched()).toBe(true);                                                                                   
    expect(onTouchedSpy).toHaveBeenCalled();                                                                                  
  });  

  it('should generate correct error messages for different validation errors', () => {                                        
    const fixture = MockRender(FormInput, { name: 'test' });                                                                  
    const component = fixture.point.componentInstance;                                                                        
                                                                                                                              
    // Test required error                                                                                                    
    const requiredControl = new FormControl('', [Validators.required]);                                                       
    requiredControl.markAsTouched();                                                                                          
    requiredControl.updateValueAndValidity();                                                                                 
                                                                                                                              
    const requiredErrors = component.getFormControlErrorsWithConfig(requiredControl);                                         
    expect(requiredErrors).toContain('Este campo es obligatorio.');                                                           
                                                                                                                              
    // Test minlength error                                                                                                   
    const minLengthControl = new FormControl('ab', [Validators.minLength(5)]);                                                
    minLengthControl.markAsTouched();                                                                                         
    minLengthControl.updateValueAndValidity();                                                                                
                                                                                                                              
    const minLengthErrors = component.getFormControlErrorsWithConfig(minLengthControl);                                       
    expect(minLengthErrors).toContain('La longitud mínima es 5 caracteres.');                                                 
                                                                                                                              
    // Test email error                                                                                                       
    const emailControl = new FormControl('invalid-email', [Validators.email]);                                                
    emailControl.markAsTouched();                                                                                             
    emailControl.updateValueAndValidity();                                                                                    
                                                                                                                              
    const emailErrors = component.getFormControlErrorsWithConfig(emailControl);                                               
    expect(emailErrors).toContain('Por favor ingrese una dirección de correo electrónico válida.');                           
  });

  it('should handle custom error messages', () => {                                                                           
    const fixture = MockRender(FormInput, { name: 'test' });                                                                  
    const component = fixture.point.componentInstance;                                                                        
                                                                                                                              
    const control = new FormControl('', [Validators.required]);                                                               
    control.markAsTouched();                                                                                                  
    control.updateValueAndValidity();                                                                                         
                                                                                                                              
    const customMessages = {                                                                                                  
      required: () => 'Custom required message'                                                                               
    };                                                                                                                        
                                                                                                                              
    const errors = component.getFormControlErrorsWithConfig(control, customMessages);                                         
    expect(errors).toContain('Custom required message');                                                                      
  });

  it('should apply error classes when hasErrors is true', () => {                                                             
    const fixture = MockRender(FormInput, { label: 'Test', name: 'test' });                                                   
    const component = fixture.point.componentInstance;                                                                        
                                                                                                                              
    component.hasErrors.set(true);                                                                                            
    fixture.detectChanges();                                                                                                  
                                                                                                                              
    const input = ngMocks.find('[data-test-id="input-elem"]');                                                                
    const label = ngMocks.find('[data-test-id="input-label"]');                                                               
                                                                                                                              
    expect(input.nativeElement).toHaveClass('error');                                                                         
    expect(label.nativeElement).toHaveClass('error');                                                                         
  });
});
