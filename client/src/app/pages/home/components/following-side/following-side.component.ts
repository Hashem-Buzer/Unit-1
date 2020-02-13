import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-following-side",
  templateUrl: "./following-side.component.html",
  styleUrls: ["./following-side.component.scss"]
})
export class FollowingSideComponent implements OnInit {
  followData: Array<any> = [];
  following: Array<any> = [];

  name: string;
  username: string;
  photo: string;

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.getFollowing();
  }

  getFollowing() {
    this._http
      .get("http://localhost:5000/follow/getfollowersinfo")
      .subscribe((data: Array<any>) => {
        data.forEach((element, i) => {
          this.name = data[i]["name"];
          this.username = data[i]["username"];
          this.photo = data[i]["photo"];

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
