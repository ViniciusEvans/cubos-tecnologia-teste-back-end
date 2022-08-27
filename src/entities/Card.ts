import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { Person } from "./Person";

@Entity("cards")
export class Card {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  type: string;

  @Column({ type: "text", unique: true })
  number: string;

  @Column({ type: "text" })
  cvv: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @ManyToOne(() => Person, (person) => person.cards)
  @JoinColumn({ name: "person_id" })
  person: Person;

  @ManyToOne(() => Account, (account) => account.cards)
  @JoinColumn({ name: "account_id" })
  account: Account;
}
