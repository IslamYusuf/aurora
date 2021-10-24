export const prices = [
    {
      name: 'Any',
      min: 0,
      max: 0,
    },
    {
      name: `ksh1 to ksh10`,
      min: 1,
      max: 10,
    },
    {
      name: `ksh10 to ksh100`,
      min: 10,
      max: 100,
    },
    {
      name: `ksh100 to ksh1000`,
      min: 100,
      max: 1000,
    },
  ];
export const ratings = [
    {
        name: '4stars & up',
        rating: 4,
    },

    {
        name: '3stars & up',
        rating: 3,
    },

    {
        name: '2stars & up',
        rating: 2,
    },

    {
        name: '1stars & up',
        rating: 1,
    },
];

const validateEmail = (email) =>{
  if(!(
    (email.indexOf(".") > 0) 
    && (email.indexOf("@") > 0)) 
    || /[^a-zA-Z0-9.@_-]/.test(email))
    return "Email address entered is invalid.\n";
  return ""
}

const validatePassword = (password,msg) =>{
  if(password.length < 6) return msg || 'Password must be atleast 6 characters\n'
  else if(!/[a-z]/.test(password) || ! /[A-Z]/.test(password) || !/[0-9]/.test(password))
  return msg || "Passwords require one each of a-z, A-Z and 0-9.\n"
  return ""
}

export const validateUserInfo = (email, password, errorMsg='') =>{
  let msg;
  msg = validateEmail(email);
  msg += validatePassword(password,errorMsg);
  if (msg === '') return {success:true};
  else return {msg, success:false}
}

