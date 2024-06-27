import "./App.css";
import { useForm } from "react-hook-form";

function App() {
  const newUserForm = useForm();
  const oldUserForm = useForm();
  const Taskform = useForm();

  function Handle_YES() {
    let Ques = document.querySelector(".Question");
    Ques.style.display = "none";
    let SN_box = document.body.querySelector(".Authentication");
    let YourNotes = document.body.querySelector(".YourNotes");
    SN_box.style.display = "block";
    YourNotes.style.display = "block";
  }

  function Handle_NO() {
    let Ques = document.querySelector(".Question");
    Ques.style.display = "none";
    let Auth = document.querySelector(".OldCustomerAuth");
    Auth.style.display = "block";
  }

  function handleclick() {
    alert("Redirecting you to Our website...");
    window.location.href = "http://localhost:3000/";
    console.log("Welcome To Your TaskManager...");
  }

  const delay = (t) => {
    return new Promise((resolve) => {
      setTimeout(resolve, t * 1000);
    });
  };

  async function onSubmitNewUser(data) {
    await delay(3);
    try {
      const response = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("New user data saved:", result);

        let Notes_sec = document.body.querySelector("#Headd");
        Notes_sec.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function onSubmitOldUser(data) {
    await delay(3);
    try {
      const response = await fetch("http://localhost:4000/Auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const Result = await response.json();
        console.log("Old user authentication completed successfully", Result);
        document.body.querySelector(".OldCustomerAuth").style.display = "none";
        document.body.querySelector(".YourNotes").style.display = "block";
        document.querySelector(".YourNotes").scrollIntoView({ behavior: "smooth" });
        alert("Authentication is successful");
      } else {
        console.log("Authentication process failed");
        alert("Authentication failed");
      }
    } catch (error) {
      console.log("Error occurred in Authentication process:", error);
      alert("An error occurred during authentication. Please try again later.");
    }
  }

  function handlesave() {
    let input = document.querySelector("#taskForm input");
    input.disabled = true;
  }
  function handlechange() {
    let input = document.querySelector("#taskForm input");
    input.disabled = false;
  }

  async function handletask(FormData) {
    await delay(3);
    console.log("These are the tasks:", FormData);
    try {
      const response = await fetch("http://localhost:4000/UserTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(FormData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("These are your Saved tasks:", result);
      } else {
        console.log("Saving proccess failed");
        alert("Some error occured in saving Tasks...");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Some error occured in Making request to Server...");
    }
  }

// Request for fetching the Data only... 
  async function fetchtask() {
    try {
      const response = await fetch("http://localhost:4000/fetchtask", {
        method: "POST"
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      console.log("Request Successful");
    } 
    catch (error) {
      console.error("An error occurred in your fetch operation:", error.message);
      console.error("Error details:", error);
    }
  }
  

  return (
    <div id="BackGround">
      <nav>
        <ul>
          <li id="Logo">
            <img onClick={handleclick} src="/Apple Branding.jpg" alt="Logo" />
          </li>
          <li className="Nom">Home</li>
          <li className="Nom">About</li>
          <li className="Nom">Contact</li>
        </ul>
      </nav>
      <main>
        <div className="Question">
          <div>Are You a New User ?????</div>
          <button onClick={Handle_YES} type="button">
            Yes
          </button>
          <button onClick={Handle_NO} type="button">
            No
          </button>
        </div>
        <div className="OldCustomerAuth">
          <div id="Title">User Authentication</div>
          <p style={{ marginTop: "0.5cm" }}>
            This is Our Authentication system for security of Users Private
            Tasks list , please enter the required details...
          </p>
          <form
            onSubmit={oldUserForm.handleSubmit(onSubmitOldUser)}
            action=""
            method="post"
          >
            <label htmlFor="email"> Email-Id:</label>
            <input
              {...oldUserForm.register("email", {
                required:
                  "This information is required for successful Authentication process...",
              })}
              id="E2"
              type="email"
              placeholder="Enter your Email_Id"
            />
            {oldUserForm.formState.errors.email && (
              <div className="red">
                {oldUserForm.formState.errors.email.message}
              </div>
            )}

            <label htmlFor="Password"> Password:</label>
            <input
              {...oldUserForm.register("password", {
                required: "This field is required.",
              })}
              id="P2"
              type="password"
              placeholder="Enter your saved password"
            />
            {oldUserForm.formState.errors.password && (
              <div className="red">
                {oldUserForm.formState.errors.password.message}
              </div>
            )}

            <button
              disabled={oldUserForm.formState.isSubmitting}
              id="SN_2"
              type="submit"
            >
              Enter
            </button>
            {oldUserForm.formState.isSubmitting && (
              <div id="Load">Loading...</div>
            )}
          </form>
        </div>
        <div className="Authentication">
          <div id="Heading">Sign In</div>
          <p>
            This is our Sign In system of User for ensuring our system to know
            some of your basic details. Fill in the necessary details required
            below.
          </p>
          <form onSubmit={newUserForm.handleSubmit(onSubmitNewUser)}>
            <ul>
              <li>
                <input
                  {...newUserForm.register("Email", {
                    required: "This field is required.",
                  })}
                  type="Email"
                  id="E"
                  placeholder="Enter Email-Address"
                  aria-label="Email"
                />
                {newUserForm.formState.errors.Email && (
                  <div className="red">
                    {newUserForm.formState.errors.Email.message}
                  </div>
                )}
              </li>
              <li>
                <input
                  {...newUserForm.register("password", {
                    required: "This field is related to your above Email.",
                  })}
                  type="password"
                  id="P"
                  placeholder="Enter Your Password"
                  aria-label="password"
                />
                {newUserForm.formState.errors.password && (
                  <div className="red">
                    {newUserForm.formState.errors.password.message}
                  </div>
                )}
              </li>
              <li>
                <input
                  {...newUserForm.register("number", {
                    required:
                      "This field is required as it is a unique identification.",
                  })}
                  type="number"
                  id="N"
                  placeholder="Enter Your Phone Number"
                  aria-label="Phone Number"
                />
                {newUserForm.formState.errors.number && (
                  <div className="red">
                    {newUserForm.formState.errors.number.message}
                  </div>
                )}
              </li>
              <li id="last">
                <input
                  {...newUserForm.register("checkbox", {
                    required: "This field needs to be checked and agreed.",
                  })}
                  type="checkbox"
                  id="tick"
                  aria-label="Agreement"
                />
                Do you agree to give your personal info to us? It will be stored
                in our database considering its SECURITY as our top priority.
                {newUserForm.formState.errors.checkbox && (
                  <div className="red">
                    {newUserForm.formState.errors.checkbox.message}
                  </div>
                )}
              </li>
            </ul>
            <button
              disabled={newUserForm.formState.isSubmitting}
              id="SN"
              type="submit"
            >
              Sign In
            </button>
            {newUserForm.formState.isSubmitting && (
              <div id="Load">Loading...</div>
            )}
          </form>
        </div>
        <div className="YourNotes">
          <span id="Headd">Your Tasks</span>
          <form
            onSubmit={Taskform.handleSubmit(handletask)}
            id="taskForm"
            className="TaskList"
          >
            <ul className="Tags">
              <li id="Final_Pass">
                <label htmlFor="Saved-Password">Saved-Password :</label>
                <input
                  type="password"
                  id="Saved-Password"
                  {...Taskform.register("Password", {
                    required: "Password is necessary to be given...",
                  })}
                />
                <button onClick={fetchtask} id="fetch" type="button">
                  FETCH TASKS
                </button>
              </li>
              {Array(10)
                .fill(null)
                .map((_, i) => (
                  <li key={i}>
                    <input type="text" {...Taskform.register(`Task-${i}`)} />
                  </li>
                ))}
            </ul>
            <ul>
              {["Save"].map((action) => (
                <li className="BTN" key={action}>
                  <button
                    disabled={Taskform.formState.isSubmitting}
                    id={action}
                    type="submit"
                    onClick={handlesave}
                  >
                    {action.toUpperCase()}
                  </button>
                  {Taskform.formState.isSubmitting && (
                    <div id="Load_2">Saving Your Tasks...</div>
                  )}
                </li>
              ))}
              <li>
                <button id="CHANGE" onClick={handlechange} type="button">
                  CHANGE
                </button>
              </li>
            </ul>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
