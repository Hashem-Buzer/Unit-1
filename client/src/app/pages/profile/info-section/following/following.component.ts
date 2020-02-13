import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-following",
  templateUrl: "./following.component.html",
  styleUrls: ["./following.component.scss"]
})
export class FollowingComponent implements OnInit {
  followData: Array<any> = [];
  following: Array<any> = [];

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.getFollowing();
  }
  getFollowing() {
    this._http
      .get("http://localhost:5000/follow/getfollowersinfo")
      .subscribe((data: Array<any>) => {
        data.forEach(element => {
          this.followData.push(element);
        });

        for (var i = 0; i < this.followData.length; i++) {
          if (
            this.followData[i]["follower_id"] == localStorage.getItem("user_id")
          ) {
            this.following.push(this.followData[i]);
          }
        }
      });
    console.log("people u follow", this.following);
  }
}
