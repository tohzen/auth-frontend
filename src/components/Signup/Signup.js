import React, { Component } from "react";

import { isAlpha, isEmail, isAlphanumeric, isStrongPassword } from "validator";
import { toast } from "react-toastify";
import Axios from "../utils/Axios";
import "./Signup.css";

export class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",  
    // ^ these variables  are blank states that hold the value of the input box ^
    firstNameError: "",
    // below are the errors that appear when the if statements are met.
    lastNameError: "",
    usernameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    isButtonDisabled: true,
    firstNameOnFocus: false,
    lastNameOnFocus: false,
    emailOnFocus: false,
    usernameOnFocus: false,
    passwordOnFocus: false,
    confirmPasswordOnFocus: false,
  };

  handleOnChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value, // this is updating everytime something changes in the input box
      },
      () => {
        // console.log("Inside setState Callback");
        // console.log(this.state.firstName);
        // console.log(event.target.name, ":", event.target.value); // keeps track of what changes are being made and saved.
        if (
          event.target.name === "firstName" ||
          event.target.name === "lastName"
        ) {
          this.handleFirstNameAndLastNameInput(event);
        }

        if (event.target.name === "email") {
          this.handleEmailInput();
        }

        if (event.target.name === "username") {
          this.handleUsernameInput();
        }
        if (event.target.name === "password") {
          this.handlePasswordInput();
        }

        if (event.target.name === "confirmPassword") {
          this.handleConfirmPasswordInput();
        }
      }
    );
  };

  handleConfirmPasswordInput = () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        confirmPasswordError: "Password does not match!",
        isButtonDisabled: true,
      });
    } else {
      this.setState({
        confirmPasswordError: "",
      });
    }
  };

  handlePasswordInput = () => {
    if (this.state.confirmPasswordOnFocus) {
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({
          confirmPasswordError: "Password does not match",
          isButtonDisabled: true,
        });
      } else {
        this.setState({
          confirmPasswordError: "",
        });
      }
    }

    if (this.state.password.length === 0) {
      this.setState({
        passwordError: "Password cannot be empty",
        isButtonDisabled: true,
      });
    } else {
      if (isStrongPassword(this.state.password)) {
        this.setState({
          passwordError: "",
        });
      } else {
        this.setState({
          passwordError:
            "Password must contains 1 uppercase, 1 lowercase, 1 special character, 1 number and minimul of 8 charactors long",
          isButtonDisabled: true,
        });
      }
    }
  };

  handleEmailInput = () => {
    if (this.state.email.length === 0) {
      this.setState({
        emailError: "Email cannot be empty",
        isButtonDisabled: true,
      });
    } else {
      if (isEmail(this.state.email)) {
        this.setState({
          emailError: "",
        });
      } else {
        this.setState({
          emailError: "Please, enter a valid email!",
          isButtonDisabled: true,
        });
      }
    }
  };

  handleFirstNameAndLastNameInput = (event) => {
    if (this.state[event.target.name].length > 0) {
      if (isAlpha(this.state[event.target.name])) {
        this.setState({
          [`${event.target.name}Error`]: "",
        });
      } else {
        this.setState({
          [`${event.target.name}Error`]: `${event.target.placeholder} can only have alphabet`,
          isButtonDisabled: true,
        });
      }
    } else {
      this.setState({
        [`${event.target.name}Error`]: `${event.target.placeholder} cannot be empty`,
        isButtonDisabled: true,
      });
    }
  };

  handleUsernameInput = () => {
    if (this.state.username.length === 0) {
      this.setState({
        usernameError: "Username cannot be empty",
        isButtonDisabled: true,
      });
    } else {
      if (isAlphanumeric(this.state.username)) {
        this.setState({
          usernameError: "",
        });
      } else {
        this.setState({
          usernameError: "Username can only have alphabet and number",
          isButtonDisabled: true,
        });
      }
    }
  };

  handleOnSubmit = async (event) => {
    event.preventDefault(); // stops from refreshing when somone submits and the array disappears if this isnt here

    try {
      let userInputObj = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
      };
      let success = await Axios.post("/api/user/sign-up", userInputObj);
      console.log(success);
      toast.success(`${success.data.message}`);
    } catch (e) {
      toast.error(`${e.response.data.message}`);
    }
  };

  handleOnBlur = (event) => {
    // console.log(event.target.name); // renders the state variable above.
    // console.log("handle onBlur Triggered");

    if (this.state[event.target.name].length === 0) { // bracket notation - if the event.target = one of the variables from state for our input boxes. If we add name - one of the variables we used in our rendered html below. If the length of the input box is 0, run the setstate below.
      this.setState
      this.setState({
        [`${event.target.name}Error`]: `${event.target.placeholder} cannot be empty`,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isButtonDisabled === true) {
      if (
        this.state.firstNameOnFocus &&
        this.state.lastNameOnFocus &&
        this.state.emailOnFocus &&
        this.state.usernameOnFocus &&
        this.state.passwordOnFocus &&
        this.state.confirmPasswordOnFocus
      ) {
        if (
          this.state.firstNameError.length === 0 &&
          this.state.lastNameError.length === 0 &&
          this.state.usernameError.length === 0 &&
          this.state.emailError.length === 0 &&
          this.state.passwordError.length === 0 &&
          this.state.confirmPasswordError.length === 0 &&
          this.state.password === this.state.confirmPassword
        ) {
          this.setState({
            isButtonDisabled: false,
          });
        }
      }
    }
  }

  handleInputOnFocus = (event) => {
    if (!this.state[`${event.target.name}OnFocus`]) {
      this.setState({
        [`${event.target.name}OnFocus`]: true,
      });
    }
  };

  render() {
    const {
      firstName, // brings the variables from the state into the html. these will be assigned as the values to our input box. Errors will appear based on onblur func.

      lastName,
      username,
      email,
      password,
      confirmPassword,
      firstNameError,
      lastNameError,
      usernameError,
      emailError,
      passwordError,
      confirmPasswordError,
    } = this.state;

    return (
      <div className="container">
        <div className="form-text">Sign up</div>

        <div className="form-div">
          <form className="form" onSubmit={this.handleOnSubmit}>  
          {/* this is saying the form will have the function handleOnSubmit */}
            <div className="form-group-inline">
              <div className="inline-container">
                <label htmlFor="firstName">First Name</label>
                <input  // input just shows whats on the html
                  type="text" // its type is text LOL
                  id="firstName" // this is the id 
                  value={firstName} // this is whats stored in the input box
                  placeholder="First Name" // placeholder until the user types something
                  name="firstName" // the name used for onblur
                  onChange={this.handleOnChange} // onchange function
                  autoFocus // when page is rendered, user will be able to type in the box that autofocus is in.
                  onBlur={this.handleOnBlur} // handles onblur, error message checker
                  onFocus={this.handleInputOnFocus}
                />
                <div className="errorMessage">
                  {firstNameError && firstNameError /* this will render if the conditions in the onblur function are met. */}  
                </div>
              </div>

              <div className="inline-container">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  name="lastName"
                  onChange={this.handleOnChange}
                  onBlur={this.handleOnBlur}
                  onFocus={this.handleInputOnFocus}
                />
                <div className="errorMessage">
                  {lastNameError && lastNameError}
                </div>
              </div>
            </div>

            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={this.handleOnChange}
                  name="email"
                  onBlur={this.handleOnBlur}
                  onFocus={this.handleInputOnFocus}
                />
                <div className="errorMessage">{emailError && emailError}</div>
              </div>
            </div>

            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  placeholder="Username"
                  onChange={this.handleOnChange}
                  name="username"
                  onBlur={this.handleOnBlur}
                  onFocus={this.handleInputOnFocus}
                />
                <div className="errorMessage">
                  {usernameError && usernameError}
                </div>
              </div>
            </div>

            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={this.handleOnChange}
                  name="password"
                  onBlur={this.handleOnBlur}
                  onFocus={this.handleInputOnFocus}
                />
                <div className="errorMessage">
                  {passwordError && passwordError}
                </div>
              </div>
            </div>

            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="text"
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={this.handleOnChange}
                  name="confirmPassword"
                  onBlur={this.handleOnBlur}
                  onFocus={this.handleInputOnFocus}
                />
                <div className="errorMessage">
                  {confirmPasswordError && confirmPasswordError}
                </div>
              </div>
            </div>

            <div className="button-container">
              <button type="submit" disabled={this.state.isButtonDisabled /* submit button */}>  
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
