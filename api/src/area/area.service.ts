import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
    // this.areaRepository.save(
    //   this.areaRepository.create({
    //     area: [
    //       [0, 0],
    //       [1, 1],
    //       [2, 2],
    //     ]
    //       .map((v) => {
    //         return `(${v[0]},${v[1]})`;
    //       })
    //       .toString(),
    //   }),
    // );
  }

  get(id: string): Promise<number[][]> {
    return this.areaRepository
      .findOne({ where: { groupId: id } })
      .then((result) => {
        return result.area
          .substring(2, result.area.length - 2)
          .split('),(')
          .map((v) => [
            parseFloat(v.split(',')[0]),
            parseFloat(v.split(',')[1]),
          ]);
      });
  }
}
