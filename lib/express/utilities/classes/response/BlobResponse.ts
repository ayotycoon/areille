import Response from './Response';

type blobResponseType = 'image/svg' | 'image/png' | 'application/pdf';

export class BlobResponse extends Response {
  public data: any;
  public type: blobResponseType;
  constructor(data: any, type: blobResponseType = 'image/svg') {
    super(data);
    this.data = data;
    this.type = type;
  }
}

export default BlobResponse;
