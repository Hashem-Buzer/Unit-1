import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/http.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AbsoluteSourceSpan } from "@angular/compiler";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  user_id: string = localStorage.getItem("user_id");
  photo: string;

  token;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _http: HttpClient
  ) {}

  ngOnInit() {
    this._http
      .post("http://localhost:5000/findById", { user_id: this.user_id })
      .subscribe(data => {
        console.log(data);
        this.photo = data[0]["photo"];
      });
    var check = setInterval(() => {
      this.token = localStorage.token;
      if (this.token) {
        document.getElementById("navBarLandingPg").style.backgroundColor =
          "#00b0ff";
        document.getElementById("navBarLandingPg").style.position =
          "webkit-sticky";
        document.getElementById("navBarLandingPg").style.position = "fixed";

        clearInterval(check);
      }
    }, 200);
  }
  logout() {
    localStorage.removeItem("token");
    const id = Number(localStorage.getItem("user_id"));
    console.log("idddd", id);
    this.http.post("http://localhost:5000/logout", { id }).subscribe(data => {
      console.log(data);
      localStorage.clear();
    });
  }

  routing() {
    if (localStorage.token) {
      this.router.navigate(["/home"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  lookUp() {
    Swal.fire({
      title: "Search by Username",
      showClass: {
        popup: "animated fadeInDownBig"
      },
      hideClass: {
        popup: "animated fadeOutUpBig"
      },
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Search",
      showLoaderOnConfirm: true,
      preConfirm: username => {
        return this.http
          .post("http://localhost:5000/findUser", { username: username })
          .subscribe(response => {
            console.log(response, "ressssponnnnnse");
            if (response["length"] < 1) {
              return Swal.fire({
                icon: "info",
                text: "This user is not there !!"
              });
            } else {
              console.log(response);
              Swal.fire({
                title: `${response[0].username}`,
                imageUrl: `http://127.0.0.1:5000/uploads/${response[0].photo}`,
                showCancelButton: true,
                cancelButtonText: "close",
                confirmButtonText: "view profile"
              }).then(result => {
                // console.log();
                if (result.value)
                  this.router.navigate([`users/${response[0].id}`]);
              });
            }
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }
}
