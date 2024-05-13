const loginSchema = ({username, password, locale, typeUser}) => ({
  Username: username,
  Password: password,
  TypeLanguage: locale === 'vi' ? 1 : 2,
  TypeUser: typeUser,
});

export {loginSchema};
