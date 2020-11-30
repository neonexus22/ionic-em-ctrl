import { Component } from "@angular/core";
import { RequestService } from "../request.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  waterLabel: string = "0%";
  waterLabelNum: number = 0;
  status: boolean = false;
  handle: any;
  isToastPresent = false;

  constructor(
    private service: RequestService,
    public toastController: ToastController
  ) {}

  ngOnInit(): void {}

  async presentToast(message, color, position) {
    const toast = await this.toastController.create({
      message,
      color,
      position,
      duration: 2000,
    });
    toast.present();
  }

  startDevice() {
    this.service.startMotor().subscribe(
      (res) => {
        if (+res === 1) {
          this.status = true;
          this.switchOnTheDevice();
          this.presentToast("Motor started successfully!", "success", "bottom");
        }
      },
      (err) => {
        this.presentToast("Error connecting server!!", "danger", "bottom");
      }
    );
  }

  stopDevice() {
    this.service.stopMotor().subscribe(
      (res) => {
        if (+res === 0) {
          this.switchOffTheDevice();
        }
      },
      (err) => {
        this.presentToast("Error connecting server!!", "danger", "bottom");
      }
    );
  }

  switchOnTheDevice() {
    if (this.status) {
      this.handle = setInterval(() => {
        this.service.getData().subscribe(
          (res) => {
            console.log(res);
            res = res[0];
            if (this.waterLabelNum < 100) {
              this.waterLabelNum += +res["sensor"];
              this.waterLabel = `${this.waterLabelNum}%`;
            } else {
              clearInterval(this.handle);
              this.status = false;
              this.switchOffTheDevice(
                "Tank is full. Motor turned off!",
                "success"
              );
            }
          },
          (err) => {
            this.presentToast("Error connecting server!!", "danger", "bottom");
            clearInterval(this.handle);
            this.status = false;
          }
        );
      }, 2000);
    }
  }

  switchOffTheDevice(
    message = "Motor successfully switched off",
    color = "primary"
  ) {
    this.service.startMotor().subscribe(
      (res) => {
        this.status = false;
        clearInterval(this.handle);
        this.handle = 0;
        this.presentToast(message, color, "bottom");
      },
      (err) => {
        this.presentToast("Error connecting server!!", "danger", "bottom");
      }
    );
  }
}
