import { Router, Query } from 'nestjs-trpc';
import { Inject } from '@nestjs/common';
import { z } from 'zod';
 
const dogSchema = z.object({
  name: z.string(),
  breed: z.enum(["Labrador", "Corgi", "Beagle", "Golden Retriver"])
});
 
@Router({alias: "hi"})
export class DogsRouter {
 
  @Query()
  sayHi(){
    return "Hi!";
  }
}