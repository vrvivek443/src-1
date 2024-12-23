// src/app/validators/must-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mustMatch(phone1: string, phone1type: string): ValidatorFn {
    console.log('phone1:', phone1);
    console.log('phone1type:', phone1type);
    return (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as AbstractControl;
        const phone1Control = formGroup.get(phone1);
        const phone1typeControl = formGroup.get(phone1type);

        if (!phone1Control || !phone1typeControl) {
            return null;
        }

        if (phone1typeControl.errors && !phone1typeControl.errors['mustMatch']) {
            // return if another validator has already found an error on the confirmPassword
            return null;
        }

        // set error on confirmPassword if validation fails
        if (phone1Control.value.length > 0) {
            if (phone1typeControl.value.length > 0) {
                phone1typeControl.setErrors({ mustMatch: true });
            } else {
                phone1typeControl.setErrors(null);
            }

        }
        return null;
    }
}
