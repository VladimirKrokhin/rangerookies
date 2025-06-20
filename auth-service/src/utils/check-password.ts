import bcrypt from 'bcrypt';

/**
 * Проверяет соответствие пароля его хешу
 * @param hashedPassword Хешированный пароль из базы данных
 * @param password Пароль в открытом виде для проверки
 * @returns true если пароль соответствует хешу, иначе false
 */
const checkPassword = (hashedPassword: string, password: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

export default checkPassword;
