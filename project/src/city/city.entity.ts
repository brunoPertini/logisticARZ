import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class City {
  @PrimaryColumn()
  name: string;

  constructor(name:string) {
      this.name = name;
  }
}