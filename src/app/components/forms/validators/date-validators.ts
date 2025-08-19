import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { parseISO, isAfter, isToday, startOfDay, isValid, format } from 'date-fns';

export function minDateValidator(minDate?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = parseISO(control.value);
    
    if (!isValid(inputDate)) {
      return { dateUnderMin: true };
    }

    const compareDate = minDate || new Date();
    const today = startOfDay(compareDate);
    const selectedDate = startOfDay(inputDate);


    if (isToday(selectedDate) || isAfter(selectedDate, today)) {
      return null;
    }

    return { 
      dateUnderMin: {
        actualValue: control.value,
        requiredDate: format(today, 'yyyy-MM-dd'), 
      }
    };
  };
}