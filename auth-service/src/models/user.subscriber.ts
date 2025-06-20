import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from './user.entity';
import hashPassword from '../utils/hash-password';

/**
 * Подписчик событий для сущности пользователя
 * Автоматически хеширует пароли при создании и обновлении пользователей
 */
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  /**
   * Указывает, к какой сущности привязан подписчик
   * @returns Класс сущности пользователя
   */
  listenTo() {
    return UserEntity;
  }

  /**
   * Обрабатывает событие перед вставкой пользователя
   * Хеширует пароль, если он не был хеширован ранее
   * @param event Событие вставки
   */
  beforeInsert(event: InsertEvent<UserEntity>) {
    if (
      event.entity.password_hash &&
      !event.entity.password_hash.startsWith('$2b$')
    ) {
      event.entity.password_hash = hashPassword(event.entity.password_hash);
    }
  }

  /**
   * Обрабатывает событие перед обновлением пользователя
   * Хеширует пароль, если он был изменен и не был хеширован ранее
   * @param event Событие обновления
   */
  beforeUpdate(event: UpdateEvent<UserEntity>) {
    if (
      event.entity?.password_hash &&
      !event.entity.password_hash.startsWith('$2b$') &&
      event.entity.password_hash !== event.databaseEntity.password_hash
    ) {
      event.entity.password_hash = hashPassword(event.entity.password_hash);
    }
  }
}
