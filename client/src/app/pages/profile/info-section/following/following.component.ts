import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-following",
  templateUrl: "./following.component.html",
  styleUrls: ["./following.component.scss"]
})
export class FollowingComponent implements OnInit {
  followData: Array<any> = [];
  following: Array<any> = [];
  followingLength: any = 0;

  id: Number;
  constructor(
    private _http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getFollowing();
  }
  getFollowing() {
    this.activatedRoute.params.subscribe(params => {
      // console.log(params, "########################kkkekekekekekekrkrkr");
      this.id = params["id"] || localStorage.getItem("user_id");
      this._http
        .get("http://localhost:5000/follow/getfollowersinfo")
        .subscribe((data: Array<any>) => {
          data.forEach(element => {
            this.followData.push(element);
          });

          for (var i = 0; i < this.followData.length; i++) {
            if (this.followData[i]["follower_id"] == this.id) {
              this.following.push(this.followData[i]);
              this.followingLength = this.following["length"];
            }
          }
          // this.followingLength = this.followData["length"];
        });
      console.log("people u follow", this.following);
    });
  }
}
