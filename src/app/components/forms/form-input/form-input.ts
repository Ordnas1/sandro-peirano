import { Component, input, signal, forwardRef, inject, computed, Injector, AfterViewInit} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => FormInput)
  }],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput implements ControlValueAccessor, AfterViewInit {
  label = input<string>()
  placeholder = input<string>()
  type = input<string>("text")
  name = input<string>()
  
  value = signal<string>("")
  touched = signal<boolean>(false)
  disabled = signal<boolean>(false)

  private ngControl: NgControl | null = null;
  private injector = inject(Injector);


  hasError = computed<boolean>(() => {
    const control = this.ngControl?.control;
    return !!(control?.invalid && (control?.dirty || control?.touched || this.touched()));
  });

  private onChange = (_value: string): void => undefined
  private onTouched = (): void => undefined

  writeValue = (value: string) => {
    this.value.set(value);
  }

  registerOnChange = (fn: (value:string) => void ) => {
    this.onChange = fn;
  }

  registerOnTouched = (fn: () => void) => {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  ngAfterViewInit(): void {
    try {
      this.ngControl = this.injector.get(NgControl, null);
    } catch {
      this.ngControl = null;
    }
  }

}
