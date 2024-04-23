import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAddressMigrate1613898690839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const addressExists = await queryRunner.hasTable('address');

    if (!addressExists) {
      await queryRunner.createTable(
        new Table({
          name: 'address',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'cep',
              type: 'varchar',
            },
            {
              name: 'street',
              type: 'varchar',
            },
            {
              name: 'streetNumber',
              type: 'int',
            },
            {
              name: 'complement',
              type: 'varchar',
            },
            {
              name: 'neighborhood',
              type: 'varchar',
            },
            {
              name: 'city',
              type: 'varchar',
            },
            {
              name: 'state',
              type: 'varchar',
            },
            {
              name: 'userId',
              type: 'int',
            },
          ],
          foreignKeys: [
            {
              columnNames: ['userId'],
              referencedColumnNames: ['id'],
              referencedTableName: 'user',
              onDelete: 'CASCADE',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('address');
  }
}
