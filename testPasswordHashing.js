const User = require("./models/user");

User.hashPassword("myPlainPassword").then((result) => {
  console.log(result);
});

User.verifyPassword(
  "myWrongPassword",
  "$argon2id$v=19$m=65536,t=5,p=1$PIDpBUKnmATFZEH9eJnBdQ$L8qRTwtA9xfpSv8ylhqUDXN1G0ezODE/7z1pe3pgeAw"
).then((passwordIsCorrect) => {
  console.log(passwordIsCorrect);
});
