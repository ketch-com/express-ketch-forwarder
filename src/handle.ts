import {Request, RequestStatus, ResponseBody} from './events'

export function handle(req: Request): ResponseBody {
  console.log(JSON.stringify(req))

  // TODO - insert your implementation here

  return {
    status: RequestStatus.Completed
  }
}
