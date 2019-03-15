import { EntityRepository, Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@EntityRepository(Warehouse)
export class WarehouseRepository extends Repository<Warehouse> {
}