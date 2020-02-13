import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent implements OnInit {
  userData: any;
  followed = false;
  followingLength: any = 0;
  followData: Array<any> = [];
  following: Array<any> = [];
  followData_sec: Array<any> = [];
  followers: Array<any> = [];
  followersLength: any = 0;
  followersNames: any = "";
  followersUserNames: any = "";

  constructor(
    private _http: HttpClient,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      var id = params["id"];
      var myId = localStorage.getItem("user_id");

      if (myId === id) {
        this.router.navigate(["/profile"]);
      } else {
        this.http
          .post("http://localhost:5000/findById", { user_id: id })
          .subscribe(data => {
            this.userData = data;
            console.log(this.userData, "FROM USER PROF");
          });
      }
      this.http
        .post("http://localhost:5000/follow/getfollowers", {
          followed_id: id
        })
        .subscribe(data => {
          for (var i = 0; i < data["length"]; i++) {
            if (data[i]["follower_id"].myId === data[i]["followed_id"].id) {
              console.log("YOU ARE FOLLOWING HIM");
              this.followed = true;
              return this.followed;
            } else {
              console.log("YOU ARE NOT FOLLOWING HIM");
              return this.followed;
            }
          }
          // console.log(data, "data");
          console.log(data, "ppl followed ");
        });
    });
  }

  follow(id) {
    var follower = localStorage.getItem("user_id");
    this.http
      .post("http://localhost:5000/follow/create", {
        follower_id: follower,
        followed_id: id
      })
      .subscribe(data => {
        this.followed = true;
        console.log(data, "user profile res follow");
      });
  }

  unFollow(id) {
    var follower = localStorage.getItem("user_id");
    this.http
      .post("http://localhost:5000/follow/delete", {
        follower_id: follower,
        followed_id: id
      })
      .subscribe(data => {
        this.followed = false;
        console.log(data, "user profile res UNFOLLOW");
      });
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
            this.followingLength = this.following["length"];
          }
        }
        // this.followingLength = this.followData["length"];
      });
    console.log("people u follow", this.following);
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
            console.log("ayy", this.followersLength);

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
