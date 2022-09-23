import {z} from 'zod'

export enum ApiVersion {
  V1 = 'dsr/v1'
}

const ApiVersionEnum = z.nativeEnum(ApiVersion)

export enum EventKind {
  Access = 'AccessStatusEvent',
  Correction = 'CorrectionStatusEvent',
  Delete = 'DeleteStatusEvent',
  RestrictProcessing = 'RestrictProcessingStatusEvent'
}

const EventKindEnum = z.nativeEnum(EventKind)

export enum RequestKind {
  Access = 'AccessRequest',
  Correction = 'CorrectionRequest',
  Delete = 'DeleteRequest',
  RestrictProcessing = 'RestrictProcessingRequest'
}

const RequestKindEnum = z.nativeEnum(RequestKind)

export enum RequestStatus {
  Unknown = 'unknown',
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Denied = 'denied'
}

const RequestStatusEnum = z.nativeEnum(RequestStatus)

export enum RequestStatusReason {
  Unknown = 'unknown',
  // NeedUserVerification = 'need_user_verification',
  SuspectedFraud = 'suspected_fraud',
  InsufficientVerification = 'insufficient_verification',
  NoMatch = 'no_match',
  ClaimNotCovered = 'claim_not_covered',
  OutsideJurisdiction = 'outside_jurisdiction',
  TooManyRequests = 'too_many_requests',
  Other = 'other'
}

const RequestStatusReasonEnum = z.nativeEnum(RequestStatusReason)

export enum ResponseKind {
  Error = 'Error',
  Access = 'AccessResponse',
  Correction = 'CorrectionResponse',
  Delete = 'DeleteResponse',
  RestrictProcessing = 'RestrictProcessingResponse'
}

const ResponseKindEnum = z.nativeEnum(ResponseKind)

export function mapRequestKindToResponseKind(rk: RequestKind): ResponseKind {
  switch (rk) {
    case RequestKind.Delete:
      return ResponseKind.Delete
    case RequestKind.Access:
      return ResponseKind.Access
    case RequestKind.Correction:
      return ResponseKind.Correction
    case RequestKind.RestrictProcessing:
      return ResponseKind.RestrictProcessing
    default:
      return ResponseKind.Error
  }
}

const CallbackType = z.object({
  url: z.string(),
  headers: z.record(z.string()).optional()
})

export interface Callback {
  url: string
  headers?: {[key: string]: string}
}

export function validateCallback(input: any): Callback {
  return CallbackType.parse(input)
}

const DataSubjectType = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateRegionCode: z.string().optional(),
  postalCode: z.string().optional(),
  countryCode: z.string().optional(),
  description: z.string().optional()
})

export interface DataSubject {
  email: string
  firstName: string
  lastName: string
  phone?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  stateRegionCode?: string
  postalCode?: string
  countryCode?: string
  description?: string
}

export function validateDataSubject(input: any): DataSubject {
  return DataSubjectType.parse(input)
}

const ErrorBodyType = z.object({
  code: z.number(),
  status: z.string(),
  message: z.string()
})

export interface ErrorBody {
  code: number
  status: string
  message: string
}

export function validateErrorBody(input: any): ErrorBody {
  return ErrorBodyType.parse(input)
}

const IdentityType = z.object({
  identitySpace: z.string(),
  identityFormat: z.string().optional(),
  identityValue: z.string()
})

export interface Identity {
  identitySpace: string
  identityFormat?: string
  identityValue: string
}

export function validateIdentity(input: any): Identity {
  return IdentityType.parse(input)
}

const MetadataType = z.object({
  uid: z.string(),
  tenant: z.string()
})

export interface Metadata {
  uid: string
  tenant: string
}

export function validateMetadata(input: any): Metadata {
  return MetadataType.parse(input)
}

const RequestBodyType = z.object({
  controller: z.string().optional(),
  property: z.string(),
  environment: z.string(),
  regulation: z.string(),
  jurisdiction: z.string(),
  purposes: z.array(z.string()).optional(),
  identities: z.array(IdentityType),
  callbacks: z.array(CallbackType).optional(),
  subject: DataSubjectType,
  claims: z.record(z.string()).optional(),
  submittedTimestamp: z.number().optional(),
  dueTimestamp: z.number().optional()
})

export interface RequestBody {
  controller?: string
  property: string
  environment: string
  regulation: string
  jurisdiction: string
  purposes?: string[]
  identities: Identity[]
  callbacks?: Callback[]
  subject: DataSubject
  claims?: {[key: string]: string}
  submittedTimestamp?: number
  dueTimestamp?: number
}

export function validateRequestBody(input: any): RequestBody {
  return RequestBodyType.parse(input)
}

const RequestType = z.object({
  apiVersion: ApiVersionEnum,
  kind: RequestKindEnum,
  metadata: MetadataType,
  request: RequestBodyType
})

export interface Request {
  apiVersion: ApiVersion
  kind: RequestKind
  metadata: Metadata
  request: RequestBody
}

export function validateRequest(input: any): Request {
  return RequestType.parse(input)
}

const ResponseBodyType = z.object({
  status: RequestStatusEnum,
  reason: RequestStatusReasonEnum.optional(),
  expectedCompletionTimestamp: z.number().optional(),
  results: z.array(CallbackType).optional(),
  requestID: z.string().optional()
  //    redirectUrl: z.string().optional(),
})

export interface ResponseBody {
  status: RequestStatus
  reason?: RequestStatusReason
  expectedCompletionTimestamp?: number
  results?: Callback[]
  requestID?: string
  //    redirectUrl?: string
}

export function validateResponseBody(input: any): ResponseBody {
  return ResponseBodyType.parse(input)
}

const ResponseType = z.object({
  apiVersion: ApiVersionEnum,
  kind: ResponseKindEnum,
  metadata: MetadataType,
  response: ResponseBodyType.optional(),
  error: ErrorBodyType.optional()
})

export interface Response {
  apiVersion: ApiVersion
  kind: ResponseKind
  metadata: Metadata
  response?: ResponseBody
  error?: ErrorBody
}

export function validateResponse(input: any): Response {
  return ResponseType.parse(input)
}
