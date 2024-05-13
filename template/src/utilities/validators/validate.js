import validatejs from 'validate.js';
import ValidateRegex from './ValidateRegex';

const validation = {
  password: {
    presence: {
      message: '^passCanNotEmpty',
      allowEmpty: false,
    },
    length: {
      minimum: 6,
      message: '^passMustMin',
    },
  },
  reEnterPass: {
    presence: {
      message: '^passCanNotEmpty',
      allowEmpty: false,
    },
  },
  phoneNumber: {
    presence: {
      message: '^phoneCanNotEmpty',
      allowEmpty: false,
    },
    format: {
      pattern: ValidateRegex.PHONE_VALIDATE,
      message: '^phoneIncorrect',
    },
  },
  //change password
  currPass: {
    presence: {
      message: '^passCanNotEmpty',
      allowEmpty: false,
    },
    length: {
      minimum: 6,
      message: '^passMustMin',
    },
  },
  newPass: {
    presence: {
      message: '^newPassCanNotEmpty',
      allowEmpty: false,
    },
    length: {
      minimum: 6,
      message: '^passMustMin',
    },
  },
  renEnterNewPass: {
    presence: {
      message: '^reEnterNewPassCanNotEmpty',
      allowEmpty: false,
    },
    length: {
      minimum: 6,
      message: '^passMustMin',
    },
  },
};

export default function validate(fieldName, value) {
  // Validate.js validates your values as an object
  // e.g. var form = {email: 'email@example.com'}
  // Line 8-9 creates an object based on the field name and field value
  let formValues = {};
  formValues[fieldName] = value;

  let formFields = {};
  formFields[fieldName] = validation[fieldName];

  // The formValues and validated against the formFields
  // the variable result hold the error messages of the field
  let result = validatejs(formValues, formFields);

  // If there is an error message, return it!
  if (result) {
    // Return only the field error message if there are multiple
    return result[fieldName][0];
  }

  return null;
}
