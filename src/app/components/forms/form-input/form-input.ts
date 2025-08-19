import {
  Component,
  forwardRef,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NgControl,
} from "@angular/forms";
import { merge, Subject, takeUntil } from "rxjs";
import { ErrorMessageConfig } from "./form";

@Component({
  selector: "app-form-input",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => FormInput),
  }],
  imports: [],
  templateUrl: "./form-input.html",
  styleUrl: "./form-input.scss",
})
export class FormInput implements ControlValueAccessor, OnInit, OnDestroy {
  label = input<string>();
  placeholder = input<string>();
  type = input<string>("text");
  name = input<string>();

  disabled = signal<boolean>(false);
  value = signal<string>("");
  touched = signal<boolean>(false);
  injector = inject(Injector);
  errorMessages = signal<string[]>([]);

  control!: FormControl;

  private onChange = (_value: string): void => undefined;
  private onTouched = (): void => undefined;
  private terminator = new Subject<void>();

  ngOnInit() {
    const ngControl = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });
    if (ngControl instanceof FormControlName) {
      const container = this.injector.get(ControlContainer)
        .control as FormGroup;

      if (!ngControl.name) {
        throw new Error("FormControlName name is not defined");
      }

      this.control = container.controls[ngControl.name] as FormControl;
    } else {
      this.control = new FormControl();
    }
    merge(this.control.valueChanges, this.control.statusChanges).pipe(
      takeUntil(this.terminator),
    ).subscribe(() => {
      this.hasErrors.set(this.control.invalid && this.touched());
      this.errorMessages.set(this.getFormControlErrorsWithConfig(this.control));
    });
  }

  ngOnDestroy(): void {
    this.terminator.next();
    this.terminator.complete();
  }

  hasErrors = signal<boolean>(false);

  writeValue = (value: string) => {
    this.value.set(value);
  };

  registerOnChange = (fn: (value: string) => void) => {
    this.onChange = fn;
  };

  registerOnTouched = (fn: () => void) => {
    this.onTouched = fn;
  };

  onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
  };

  onBlur = () => {
    this.touched.set(true);
    this.onTouched();
  };

  setDisabledState = (isDisabled: boolean) => {
    this.disabled.set(isDisabled);
  };

  getFormControlErrorsWithConfig = (
    control: AbstractControl | null,
    customMessages?: ErrorMessageConfig,
  ): string[] => {
    const errors: string[] = [];

    if (!control || !control.errors || control.valid) {
      return errors;
    }

    const defaultMessages: ErrorMessageConfig = {
      required: () => "Este campo es obligatorio.",
      email: () =>
        "Por favor ingrese una dirección de correo electrónico válida.",
      minlength: (error) =>
        `La longitud mínima es ${error["requiredLength"]} caracteres.`,
      maxlength: (error) =>
        `La longitud máxima es ${error["requiredLength"]} caracteres.`,
      min: (error) => `El valor mínimo es ${error["min"]}.`,
      max: (error) => `El valor máximo es ${error["max"]}.`,
      itExists: () => "El valor de la ID ya existe",
    };

    const messageConfig = { ...defaultMessages, ...customMessages };
    Object.keys(control.errors).forEach((errorKey) => {
      if (messageConfig[errorKey]) {
        errors.push(messageConfig[errorKey](control.errors![errorKey]));
      } else {
        errors.push(`Invalid ${errorKey}.`);
      }
    });

    return errors;
  };
}
