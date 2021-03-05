const User = require('../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async (email, password, done) => {
      try {
        const user = await User.findOne({email});
        if (!user) return done(null, false, 'Нет такого пользователя');

        const passwordValid = await user.checkPassword(password);
        if (!passwordValid) return done(null, false, 'Неверный пароль');

        return done(null, user);
      } catch (err) {
        done(err);
      }
    },
);
