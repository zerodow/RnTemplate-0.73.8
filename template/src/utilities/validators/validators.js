import moment from 'moment';
import validatejs from 'validate.js';

export function blankCheck(message) {
  return {
    presence: {
      message,
      allowEmpty: false,
    },
  };
}

export default function validators({fieldName, value, validation}) {
  try {
    // Validate.js validates your values as an object
    let formValues = {};
    formValues[fieldName] = value;

    let formFields = {};
    formFields[fieldName] = validation[fieldName];
    // using custom from validation object
    validatejs.validators.custom = formFields[fieldName].custom;
    validatejs.extend(validatejs.validators.datetime, {
      // The value is guaranteed not to be null or undefined but otherwise it
      // could be anything.
      parse: function (val, options) {
        return +moment.utc(val);
      },
      // Input is a unix timestamp
      format: function (val, options) {
        var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
        return moment.utc(val).format(format);
      },
    });
    // The formValues and validated against the formFields
    // the variable result hold the error messages of the field
    let result = validatejs(formValues, formFields);
    // If there is an error message, return it!
    if (result) {
      // Return only the field error message if there are multiple
      return result[fieldName][0];
    }
  } catch (error) {}

  return null;
}
