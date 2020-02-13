import { UserService } from "../../../user.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  Users;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      console.log(users, "u");
      this.Users = users.json();
    });
  }

  getUser() {
    return this.userService.getLoggedInUser().username;
  }
}
