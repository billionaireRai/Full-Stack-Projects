console.log("Hellow World!");
console.log("Welcome to AlpheNex...");

// Adding typer animation to the planed place..
  document.addEventListener("DOMContentLoaded", function () {
    var typed = new Typed("#Typer", {
      strings: [
        "These are the Skills our professionals are having ",
        "Full Stack Web Developer",
        "Data Scientists",
        "Machine Learning Engineer",
        "CEO and Founder of AlpheNex.",
      ],
      typeSpeed: 50,
      backSpeed: 20,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
    });
  });

// Adding event listner to brand logo.
let Logo = document.getElementById("Logo");
Logo.addEventListener("click", () => {
  console.log("Redirecting you to www.AlpheNex.com");
  window.location.href = "http://127.0.0.1:3000/Buisness.Portfolio.html";
});

// Adding event listeners to social media icons...
let target_num = [0, 1, 2, 3];
let SM_icon = document.body.querySelector(".SocialMedia_Info").querySelectorAll(".SM");
for (let index = 0; index < target_num.length; index++) {
  const element = target_num[index];
  if (element === 0) {
    let Twitter = SM_icon[element];
    Twitter.addEventListener("click", () => {
      console.log("Redirecting you to our X Account");
      window.location.href = "https://x.com/?lang-en=";
    });
  } else if (element === 1) {
    let Facebook = SM_icon[element];
    Facebook.addEventListener("click", () => {
      console.log("Redirecting you to our facebook Account");
      window.location.href = "https://www.facebook.com/";
    });
  } else if (element === 2) {
    let Insta = SM_icon[element];
    Insta.addEventListener("click", () => {
      console.log("Redirecting you to our instagram Account");
      window.location.href = "https://www.instagram.com/";
    });
  } else {
    let linkedin = SM_icon[element];
    linkedin.addEventListener("click", () => {
      console.log("Redirecting you to our linkedin Account");
      window.location.href = "https://www.linkedin.com/";
    });
  }
}

// adding event listeners to Controller icons..
let Controller = document.body.querySelector(".Controller").querySelectorAll(".CTL");
// home..
let Home = Controller[0];
Home.addEventListener("click", () => {
  // Get the target section element
  let targetSection = document.getElementById('BackGround');
  // Scroll to the target section
  targetSection.scrollIntoView({ behavior: 'smooth' });
  console.log("Your ViewPort is shifted to Home section.. ");
});

// About..
let About = Controller[1];
About.addEventListener("click", () => {

  let targetSection = document.body.querySelector('.About');
  targetSection.scrollIntoView({ behavior: 'smooth' });
  console.log("Your ViewPort is shifted to About section.. ");
});

// Resume..
let Resume = Controller[2];
Resume.addEventListener("click", () => {

  let targetSection = document.body.querySelector('.Resume');
  targetSection.scrollIntoView({ behavior: 'smooth' });
  console.log("Your ViewPort is shifted to Resume section.. ");
});

// Portfolio..
let Portfolio = Controller[3];
Portfolio.addEventListener("click", () => {
 
  let targetSection = document.body.querySelector('.Made_Projects');
  targetSection.scrollIntoView({ behavior: 'smooth' });
  console.log("Your ViewPort is shifted to Portfolio section.. ");
});

// Services..
let Services = Controller[4];
Services.addEventListener("click", () => {

  let targetSection = document.body.querySelector('.portfolio');
  targetSection.scrollIntoView({ behavior: 'smooth' });
  console.log("Your ViewPort is shifted to Services section.. ");
});

// Contact..
let Contact = Controller[5];
Contact.addEventListener("click", () => {

  let targetSection = document.body.querySelector('.Contact');
  targetSection.scrollIntoView({ behavior: 'smooth' });
  console.log("Your ViewPort is shifted to Contact section.. ");
});
// Remember to add animation to variable_Scale_1 filling from left to right..

let last_li = document.getElementById('dot_blinker');
function Blinker() {
  setInterval(() => {
    last_li.innerHTML += ".";
    if (last_li.innerHTML.endsWith("......")) {
      last_li.innerHTML= "MANY MORE IN PROGRESS";
    } 
    else {
      last_li.innerHTML += ".";
      
    }
  },150);
  
}
Blinker()

// Adding event listner to sticky button...
let Sticky_button = document.querySelector('.sticky-button');
Sticky_button.addEventListener('click',() => { 
  let Section = document.getElementById('BackGround');
  Section.scrollIntoView({behavior:'smooth'});
  console.log("Now you are at the top section of this WebPage...")
 })


//  Handling the data entered by thee user....
 let Name = document.getElementById("CustomerName");
let Email = document.getElementById("CustomerEmail");
let Subject = document.getElementById("CustomerSubject");
let PhoneNo = document.getElementById("CustomerNumber");
let Message = document.getElementById("CustomerMessage");
let Send_btn = document.getElementById('B1');

Send_btn.addEventListener('click', async () => { 
  console.log("Yes, event listener is working...");

  let Email_Info = {
    name: Name.value,
    email: Email.value,
    subject: Subject.value,
    phone: PhoneNo.value,
    message: Message.value,
  };

  try {
    // Make a POST request to the server
    const response = await fetch('http://localhost:3000/customers', { // Corrected URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Email_Info),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Customer data saved:', result);
    } 
    else {
      console.error('Failed to save customer data');
    }
  } 
  catch (error) {
    console.error('Error:', error);
  }
});

 

