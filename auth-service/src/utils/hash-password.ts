import bcrypt from 'bcrypt';

/**
 * Хеширует пароль с использованием bcrypt
 * @param password Пароль в открытом виде
 * @returns Хешированный пароль
 */
const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export default hashPassword;
