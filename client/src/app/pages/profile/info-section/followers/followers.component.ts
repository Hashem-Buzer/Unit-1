import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-followers",
  templateUrl: "./followers.component.html",
  styleUrls: ["./followers.component.scss"]
})
export class FollowersComponent implements OnInit {
  followData_sec: Array<any> = [];
  followers: Array<any> = [];
  followersLength: any;
  followersNames: any = "";
  followersPhoto: any = "";
  followersUserNames: any = "";

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.getPeopleFollowingYou();
  }
  getPeopleFollowingYou() {
    this._http
      .get("http://localhost:5000/follow/getfollowinglist")
      .subscribe((data: Array<any>) => {
        data.forEach(element => {
          this.followData_sec.push(element);
        });

        for (var i = 0; i < this.followData_sec.length; i++) {
          if (
            this.followData_sec[i]["followed_id"] ==
            localStorage.getItem("user_id")
          ) {
            this.followers.push(this.followData_sec[i]);
            this.followersLength = this.followers["length"];

            this.followers.forEach(element => {
              this.followersNames += element.name;
              this.followersUserNames += element.username;
              // this.followersUserNames += element.username + "<br>";
              // this.followersPhoto +=
              //   `http://127.0.0.1:5000/uploads/${element.photo}` + "<br>";
            });
          }
        }
        console.log("************* people that follow u", this.followers);
      });
  }
}
