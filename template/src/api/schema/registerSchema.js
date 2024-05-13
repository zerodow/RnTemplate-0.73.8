const registerRequestSchema = ({phoneNumber, locale}) => ({
  PhoneMain: phoneNumber,
  LanguageId: locale === 'vi' ? 1 : 2,
});

const newPasswordSchema = ({
  userId,
  passwordOld,
  passwordNew,
  userName,
  currentPassword,
  newPassword,
}) => ({
  userId: userId || '',
  passwordOld: passwordOld || '',
  passwordNew: passwordNew || '',
  userName: userName || '',
  currentPassword: currentPassword || '',
  newPassword: newPassword || '',
});

export {registerRequestSchema, newPasswordSchema};
