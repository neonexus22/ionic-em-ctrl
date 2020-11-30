import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RequestService {
  url = "http://192.168.4.1";

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.url}/sensor_value`);
  }

  startMotor() {
    return this.http.get(`${this.url}/switch_status/1`);
  }

  stopMotor() {
    return this.http.get(`${this.url}/switch_status/0`);
  }
}
