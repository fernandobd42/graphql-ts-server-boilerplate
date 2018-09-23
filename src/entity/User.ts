import {
  Entity, 
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert
} from "typeorm"
import * as bcrypt from 'bcryptjs'

@Entity("users")
export class User extends BaseEntity{

  @PrimaryGeneratedColumn("uuid") 
  id: string

  @Column("varchar", { length: 255, nullable: true })
  email: string | null
  
  @Column("text") 
  password: string;

  @Column("boolean", { default: false })
  confirmed: boolean

  @Column("boolean", { default: false })
  forgotPasswordLocked: boolean

  @Column("text", { nullable: true })
  twitterId: string | null

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
