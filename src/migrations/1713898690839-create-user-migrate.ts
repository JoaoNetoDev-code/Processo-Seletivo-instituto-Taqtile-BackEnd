import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserMigrate1713898690839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userExists = await queryRunner.hasTable('user');

    if (!userExists) {
      await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'email',
              type: 'varchar',
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'birthDate',
              type: 'timestamp',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
