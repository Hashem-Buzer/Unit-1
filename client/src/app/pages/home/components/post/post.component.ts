import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";

import Swal from "sweetalert2";
import { HttpService } from "src/app/http.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {
  // @Output() renderPosts: any = new EventEmitter();

  // childPost() {
  //   console.log("i am the useless method");
  //   this.renderPosts.emit(this.renderPosts);
  // }

  fileData: File = null;
  post: string = "";
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  constructor(private http: HttpClient, private _http: HttpService) {}

  ngOnInit() {}

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  postText(event: any) {
    this.post = event.target.value;
  }

  preview() {
    if (this.fileData == null) {
      this.previewUrl = "";
      return;
    }
    // Show preview
    var mimeType = this.fileData.type.split("/")[0];

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    if (mimeType == "video") {
      reader.onload = _event => {
        this.previewUrl =
          "https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-1/128/play-icon-2-512.png";
      };
    } else if (mimeType == "image") {
      reader.onload = _event => {
        this.previewUrl = reader.result;
      };
    } else if (mimeType == "audio") {
      reader.onload = _event => {
        this.previewUrl =
          "https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png";
      };
    }
  }
  onSubmit() {
    const formData = new FormData();
    console.log(this.fileData);

    if (!this.fileData) {
      return Swal.fire("Empty?", "You Have Got To Upload Something", "error");
    }

    var type = this.fileData.type.split("/")[0];
    var size = this.fileData.size;

    if (size > 10000000 && type === "video") {
      return Swal.fire(
        "So Large !!",
        ` Your ${type} Can't be larger than 10MB`,
        "warning"
      );
    }
    if (size > 30000000 && type === "audio") {
      return Swal.fire(
        "So Large For an audio..",
        ` Your ${type} Can't be larger than 3MB`,
        "warning"
      );
    }
    if (size > 5000000 && type === "image") {
      return Swal.fire(
        "So Large For an Image..",
        ` Your ${type} Can't be larger than 5MB`,
        "warning"
      );
    }
    if (type !== "image" && type !== "video" && type !== "audio") {
      return Swal.fire(
        "You only can post Images / Videos and Audios",
        "warning"
      );
    }

    formData.append("files", this.fileData); // here we pass the file
    formData.append("user_id", localStorage.user_id); // here we pass user id
    formData.append("post_text", this.post); // here we pass post text
    formData.append("type", this.fileData.type); // here we pass data type

    // let headers = new HttpHeaders({
    //   "Content-Type": "application/json",
    //   authentication: localStorage.getItem("token")
    // });

    this.http
      .post("http://localhost:5000/posts/post", formData)
      .subscribe(data => {
        this.post = "";

        let timerInterval;
        Swal.fire({
          position: "top",
          title: `Posting your ${type}`,
          html: "Uploading..",
          timer: 2000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          onClose: () => {
            clearInterval(timerInterval);
          }
        })
          .then(result => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
          })
          .then(() => {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Posted !!",
              showConfirmButton: false,
              timer: 1500
            });
          })
          .then(() => {
            console.log(data, "from post component");
            this._http.newPost.next(data);
            this.fileData = null;
            this.preview();
          });
      });
  }
}
