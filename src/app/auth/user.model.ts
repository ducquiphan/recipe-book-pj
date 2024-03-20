export class User {
  constructor(public email: string, public id: string, private _token: string, private _tokenExpirationDate: Date) {
  }


  get token(): string {
    if (!this._tokenExpirationDate || (new Date() > this._tokenExpirationDate)) {
      return null;
    }
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  set tokenExpirationDate(value: Date) {
    this._tokenExpirationDate = value;
  }


  get tokenExpirationDate(): Date {
    return this._tokenExpirationDate;
  }
}
