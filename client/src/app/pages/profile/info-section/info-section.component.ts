import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { element } from "protractor";

@Component({
  selector: "app-info-section",
  templateUrl: "./info-section.component.html",
  styleUrls: ["./info-section.component.scss"]
})
export class InfoSectionComponent implements OnInit {
  fileData: File = null;
  followingLength: any = 0;

  followData: Array<any> = [];
  followData_sec: Array<any> = [];
  following: Array<any> = [];
  followers: Array<any> = [];

  //
  followersLength: any = 0;
  followersNames: any = "";
  followersPhoto: any = "";
  followersUserNames: any = "";

  constructor(private _http: HttpClient) {}
  user_id: string = localStorage.getItem("user_id");
  name: string;
  username: string;
  email: string;
  age: string;
  bio: string;
  gender: string;
  photo: string;

  ngOnInit() {
    // this.getFollow();
    this.getFollowing();
    this.getPeopleFollowingYou();
    this._http
      .post("http://localhost:5000/findById", { user_id: this.user_id })
      .subscribe(data => {
        console.log(data);
        this.name = data[0]["name"];
        this.username = data[0]["username"];
        this.age = data[0]["age"];
        this.email = data[0]["email"];
        this.bio = data[0]["bio"];
        this.gender = data[0]["gender"];
        this.photo = data[0]["photo"];
      });
    this._http
      .post("http://localhost:5000/follow/getfollowers", {
        followed_id: this.user_id
      })
      .subscribe(data => {
        console.log(data, "followerrrrrrrrrrrrrs");
      });
  }

  onUploadPhoto(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    if (
      this.fileData["type"].split("/")[0] === "video" ||
      this.fileData["type"].split("/")[0] === "audio"
    ) {
      Swal.fire({
        titleText: "You can't upload non image files",
        icon: "error"
      });
      return false;
    }
    // console.log(this.fileData, "type");

    const formData = new FormData();
    const user_id = localStorage.getItem("user_id");

    formData.append("files", this.fileData); // here we pass the file
    formData.append("user_id", localStorage.user_id); // here we pass user id
    this._http
      .post("http://localhost:5000/updatePhoto", formData)
      .subscribe(data => {
        console.log(data);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Profile Photo Updated !!",
          showConfirmButton: false,
          timer: 1500
        });
        this._http
          .post("http://localhost:5000/findById", { user_id })
          .subscribe(data => {
            console.log(data);
            this.photo = data[0]["photo"];
          });
      });
    //
  }

  // getFollow() {
  //   this._http
  //     .get("http://localhost:5000/follow/getfollowersInfo")
  //     .subscribe((data: Array<any>) => {
  //       // console.log(data, "data");
  //       data.forEach(element => {
  //         if (element["followed_id"] == this.user_id) {
  //           this.followers.push(element);
  //         }
  //       });

  //       this.followersLength = this.followers["length"];
  //       this.followers.forEach(element => {
  //         console.log(element, "elem");
  //         this.followersNames += element.name + "<br>";
  //         this.followersUserNames += element.username + "<br>";
  //         this.followersPhoto +=
  //           `http://127.0.0.1:5000/uploads/${element.photo}` + "<br>";
  //       });
  //       // console.log(this.followers, "ff");
  //     });
  // }

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

  // followersInfo() {
  //   Swal.fire({
  //     html: ""
  //   });
  // }
}
