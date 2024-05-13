import ValidateRegex from './ValidateRegex';
import {blankCheck} from './validators';

const UserInfoValidators = {
  fullName: {
    ...blankCheck('^Họ và tên không được để trống'),
    length: {
      minimum: 3,
      maximum: 70,
      message: '^Họ và tên phải từ 3 đến 70 ký tự',
    },
  },
  phone: {
    ...blankCheck('^Số điện thoại không được để trống'),
    format: {
      pattern: ValidateRegex.PHONE_VALIDATE,
      message: '^Số điện thoại không đúng định dạng',
    },
  },
  cardId: {
    ...blankCheck('^Số CMND/CCCD không được để trống'),
    format: {
      pattern: /^[0-9]{9}$|^[0-9]{12}$/,
      message: '^Số CMND/CCCD phải có 9 hoặc 12 ký tự',
    },
  },
  email: {
    ...blankCheck('^Email không được để trống'),
    format: {
      pattern: ValidateRegex.EMAIL,
      message: '^Email sai định dạng',
    },
    length: {
      minimum: 1,
      maximum: 50,
      message: '^Email phải từ 1 đến 50 ký tự',
    },
  },
  birthday: {
    ...blankCheck('^Ngày sinh không được để trống'),
    // datetime: {
    //   dateOnly: true,
    //   latest: moment.utc().subtract(18, 'years'),
    //   message: '^Phải trên 18 tuổi',
    // },
  },
};

export default UserInfoValidators;
