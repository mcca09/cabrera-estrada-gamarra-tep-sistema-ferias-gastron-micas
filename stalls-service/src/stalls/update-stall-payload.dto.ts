import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateStallDto } from './update-stall.dto';

export class UpdateStallPayload {
  @IsUUID()
  id: string;

  @IsUUID()
  ownerId: string;

  @ValidateNested()
  @Type(() => UpdateStallDto)
  updateData: UpdateStallDto;
}
