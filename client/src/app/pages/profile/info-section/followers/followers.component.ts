import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

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

  followingLength: any = 0;
  followData: Array<any> = [];
  following: Array<any> = [];

  id: Number;

  constructor(
    private _http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getPeopleFollowingYou();
  }
  getPeopleFollowingYou() {
    this.activatedRoute.params.subscribe(params => {
      // console.log(params, "@@@@@@@@@@kkkekekekekekekrkrkr");
      this.id = params["id"] || localStorage.getItem("user_id");
      this._http
        .get("http://localhost:5000/follow/getfollowinglist")
        .subscribe((data: Array<any>) => {
          data.forEach(element => {
            this.followData_sec.push(element);
          });

          for (var i = 0; i < this.followData_sec.length; i++) {
            if (this.followData_sec[i]["followed_id"] == this.id) {
              this.followers.push(this.followData_sec[i]);
              this.followersLength = this.followers["length"];

              this.followers.forEach(element => {
                this.followersNames += element.name;
                this.followersUserNames += element.username;
              });
            }
          }
          console.log("************* people that follow u", this.followers);
        });
    });
  }
}
