import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Group {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  ref: string;

  @Column({
    default: false,
  })
  isBanned: Boolean;
}
