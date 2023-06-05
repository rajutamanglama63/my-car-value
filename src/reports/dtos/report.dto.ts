import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  // we use expose decorator to make sure it gets expose or exclusively shared on out going response
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  // we can simply add new property

  // to pull some property from original report entity we use transform decorator where obj refers to original report entity
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
