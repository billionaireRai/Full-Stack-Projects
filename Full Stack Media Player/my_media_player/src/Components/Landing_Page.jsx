import "./Landing_Page.css";
import { useEffect, useRef } from "react";
import { useScroll , motion , useSpring} from "framer-motion"; // using framer-motion for adding animations... 
import Typed from "typed.js";

function App({dot}) {
  let Top_Sec = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // function for simulating the delay...
  const delaySimulator = (t) => { 
    return new Promise((resolve) => setTimeout(resolve, t * 1000));
}
  // Function for hanlding scroll to the top...
  const handleScroll = () => {
    Top_Sec.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleShowText = (ParentBox_id,img_class) => { 
    let arrow = document.querySelector(`.${img_class}`) ;
    arrow.classList.toggle('rotate');
    
    let textSection = document.querySelector(`#${ParentBox_id}`);
    if (textSection.style.height)  textSection.style.height = null ; // Collapses if height is already there...
     else {
      const scrollHeight = textSection.scrollHeight ; // Get full height
      textSection.style.height = `${scrollHeight}px`; // Expand to full height
    }
    delaySimulator(2) ;
   }
  useEffect(() => {
    const Typer = new Typed("#typed", {
      strings: ["Discover your new favorite artist","Stream millions of songs for free","Create playlists that move you","Music that takes you anywhere","Streamify - Your music, amplified","Where music meets passion","Tune in, turn up, and relax","The rhythm of your life, on demand",
      ],
      loop: true,
      typeSpeed: 40, // adjust the typing speed
      backSpeed: 20, // adjust the backspace speed
      backDelay: 1500, // adjust the delay before backspacing
      startDelay: 1000, // adjust the delay before starting the animation
      cursorChar: "|", // change the cursor character
      autoInsertCss: true, // automatically insert CSS for the animation
    });
    return () => {
      Typer.destroy();
    };
  }, []);
  return (
    <div className="App">
      <motion.div style={{ transformOrigin: '0%', height: '5px', borderRadius: '10px', zIndex: 2, scaleX:scaleX , backgroundColor: 'yellow', width: '100%', position: 'fixed', top: 0 }}/>
      <div ref={Top_Sec} className="Bg-Img">
        <div className="Text">
          <span>Welcome To Our Music-Player</span>
          <div>
            We Help You listen Your Favourite Music Anytime & Anywhere. Discover
            new artists, create personalized playlists, and access millions of
            songs. Start listening now and experience the ultimate music
            experience!
          </div>
          <span>Benefits of Our MusicPlayer</span>
          <div id="typed"></div>
        </div>
        <div className="right">
          <video autoPlay loop muted>
            <source src="../SoundVisualizers/SoundVisualizer_10.mp4" type="video/mp4" />
          </video>
          <h2 className="Centre"> Enjoy World class Music of Streamify Powered by - </h2>
          <span className="Centre"> AlpheNex <sup>R</sup> Corporation </span>
        </div>
        <button onClick={handleScroll} id="UpArrow" type="button">
          <img src="/Images/UpArrow.Icon.png" alt="img" />
        </button>
      </div>
      <body>
        <span id="top">What You'll be Getting</span>
        <h2 className="TEX"> Enjoy The Essence of Real Music With Our Large SONG Database... </h2>
        <p className="para">
          Our Music Player is designed to provide you with an unparalleled music
          experience. With a vast library of Hip-Hop , Romantice , and many more
          Varities of Musics!!!
        </p>
        <div className="GridSystem">
          <div className="GridItem">
            <div> <img src="/Images/Library.Icon.png" alt="img" /> </div>
            <span>Vast Music Library</span>
            <p>
              Enjoy access to millions of songs across various genres, ensuring
              you never run out of music to listen to.
            </p>
          </div>
          <div className="GridItem">
            <div> <img src="/Images/Playlist.Icon.png" alt="img" /> </div>
            <span>Personalized Playlists</span>
            <p>
              Create and manage your own playlists, tailored to your unique
              music tastes and preferences.
            </p>
          </div>
          <div className="GridItem">
            <div> <img src="/Images/Discovery.Icon.png" alt="img" /> </div>
            <span>Music Discovery</span>
            <p>
              Discover new artists, genres, and tracks with our advanced music
              recommendation engine.
            </p>
          </div>
          <div className="GridItem">
            <div> <img src="/Images/Offline.Icon.png" alt="img" /> </div>
            <span>Offline Listening</span>
            <p>
              Download your favorite tracks and listen to them offline, anytime,
              anywhere.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Social.Icon.png" alt="img" /></div>
            <span>Social Sharing</span>
            <p>
              Share your favorite tracks and playlists with friends and family
              on social media.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Radio.Icon.png" alt="img" /></div>
            <span>Live Radio Stations</span>
            <p>
              Tune into live radio stations from around the world, featuring
              your favorite artists and genres.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Lyrics.Icon.png" alt="img" /></div>
            <span>Song Lyrics</span>
            <p>
              Access lyrics to your favorite songs, and sing along with
              confidence.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Mood.Icon.png" alt="img" /></div>
            <span>Mood-Based Playlists</span>
            <p>
              Listen to playlists curated based on your mood, activity, or
              occasion.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Artist.Icon.png" alt="img" /></div>
            <span>Artist Profiles</span>
            <p>
              Explore detailed profiles of your favorite artists, including
              their discography and biography.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Community.Icon.png" alt="img" /></div>
            <span>Music Community</span>
            <p>
              Join a community of music lovers, share your thoughts, and
              discover new music together.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Premium.Icon.png" alt="img" /></div>
            <span>Premium Features</span>
            <p>
              Upgrade to our premium subscription for ad-free listening,
              exclusive content, and more.
            </p>
          </div>
          <div className="GridItem">
            <div><img src="/Images/Equilizer.Icon.png" alt="img" /></div>
            <span>Audio Enhancement</span>
            <p>
              Experience crystal-clear sound with our advanced audio enhancement features,
              tailored to optimize your listening experience.
            </p>
          </div>
        </div>
          <span id="top">What You'll be Getting</span>
          <h1 id="FAQ">Frequently Asked Question{dot}</h1>
          <div id="mainbox">
            <p>Get quick answers to your major questions , make informed decision before starting your journey !!!</p>
            <div id="box_1">
              <ul>
                <li>How can I create a playlist?</li>
                <li><img className="RotatingArrow_1" onClick={() => { handleShowText('box_1','RotatingArrow_1') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                To create a playlist, go to the 'Playlists' section, click on 'Create New Playlist', give it a name, and start adding your favorite songs to it. You can also rearrange the order of the songs in your playlist as per your preference.
              </p>
            </div>
            <div id="box_2">
            <ul>
                <li>Can I listen to music offline?</li>
                <li><img alt="img" className="RotatingArrow_2" onClick={() => { handleShowText('box_2','RotatingArrow_2') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                Yes, you can download your favorite tracks for offline listening. Simply click the download button next to the song or album, and it will be saved to your device for offline access.
              </p>
            </div>
            <div id="box_3">
            <ul>
                <li>How do I share a song with my friends?</li>
                <li><img alt="img" className="RotatingArrow_3" onClick={() => { handleShowText('box_3','RotatingArrow_3') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                To share a song, click on the 'Share' icon next to the track. You can then choose to share it via social media, email, or copy the link to send it directly to your friends.
              </p>
            </div>
            <div id="box_4">
            <ul>
                <li>What should I do if I encounter playback issues?</li>
                <li><img alt="img" className="RotatingArrow_4" onClick={() => { handleShowText('box_4','RotatingArrow_4') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                If you encounter playback issues, try checking your internet connection, restarting the app, or clearing the app cache. If the problem persists, you can reach out to our support team for assistance.
              </p>
            </div>
            <div id="box_5">
            <ul>
                <li>How can I find new music?</li>
                <li><img alt="img" className="RotatingArrow_5" onClick={() => { handleShowText('box_5','RotatingArrow_5') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                You can find new music by exploring the 'Discover' section, where we recommend songs based on your listening history. You can also check out curated playlists and trending tracks to find new favorites.
              </p>
            </div>
            <div id="box_6">
              <ul>
                <li>Can I customize my listening experience?</li>
                <li><img alt="img" className="RotatingArrow_6" onClick={() => { handleShowText('box_6','RotatingArrow_6') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                Yes, you can customize your listening experience by adjusting the equalizer settings, choosing different themes, and selecting personalized playlists based on your mood or activity.
              </p>
            </div>
            <div id="box_7">
              <ul>
                <li>Is there a premium subscription available?</li>
                <li><img alt="img" className="RotatingArrow_7" onClick={() => { handleShowText('box_7','RotatingArrow_7') }} src="/Images/arrow-down-sign-to-navigate.png" /></li>
              </ul>
              <p>
                Yes, we offer a premium subscription that provides ad-free listening, offline access, and exclusive content. You can upgrade your account anytime from the settings menu.
              </p>
            </div>
          </div>
      <div className='Lower_section'>
        <ul>
          <li id="Adsd" >For More Handy Experience,Download the Streamifies Mobile App Now</li>
          <li><a href="https://play.google.com/store/search?q=spotify&c=apps" rel="noreferrer" target="_blank" class="sc-doohEh eBBcOC"><img height="auto" width="250px" class="sc-bmzYkS duamAe sc-dxlmjS bhTIdR" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png" alt="Download Android App" /></a></li>
          <li><a href="https://apps.apple.com/in/app/spotify-music-and-podcasts/id324684580" rel="noreferrer" target="_blank" class="sc-doohEh eBBcOC"><img height="auto" width="250px" class="sc-bmzYkS duamAe sc-dxlmjS bhTIdR" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png" alt="Download iOS App" /></a></li>
        </ul>
      </div>
      <div className='Lower_Sec'>
        <ul>
          <li><svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_b_674_19294)"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.3819 14.7977C20.5245 13.9563 20.3574 13.3121 19.9261 12.9756C19.2787 12.4711 18.3021 12.1959 15.9859 12.204C14.2724 12.2082 12.4327 12.2167 11.6469 12.2205C11.5739 12.2082 11.3093 12.1181 11.297 11.7938L11.2683 6.64781C11.2683 6.3236 11.5207 6.05694 11.8385 6.05694C12.1559 6.05694 12.412 6.31936 12.412 6.64358C12.412 6.64358 12.4285 9.43839 12.4327 10.4314C12.4327 10.5257 12.4897 10.7513 12.7011 10.8089C14.085 11.1822 21.0778 10.883 20.9639 9.57764C20.3536 4.16496 15.8884 -0.0164585 10.4829 4.87055e-05C8.78164 0.00385807 7.16965 0.426698 5.745 1.16952C2.33815 2.98744 -0.0755529 6.63977 0.00180748 10.8542C0.0546894 13.8374 1.98811 19.1396 3.16037 19.923C3.70173 20.2845 4.40996 20.1491 7.58886 20.1368C9.0298 20.1325 10.3732 20.1325 11.0324 20.1325C11.1016 20.1448 11.4599 20.2312 11.4637 20.5677L11.484 24.4782C11.484 24.8024 11.232 25.0691 10.9142 25.0691C10.5968 25.0691 10.3402 24.8109 10.3402 24.4824C10.3402 24.4824 10.3647 22.9108 10.3609 22.328C10.3609 22.1926 10.3689 21.9585 9.98235 21.7862C8.71622 21.2119 4.60532 21.5729 4.37737 22.2129C4.29191 22.4592 4.75185 23.4073 5.46418 24.6259C7.83331 28.4425 10.1571 31.4176 10.5318 31.8937C10.5563 31.9141 10.5766 31.9348 10.5968 31.9471C10.9104 31.5611 19.1078 22.2747 20.3819 14.7977Z" fill="white"></path></g><defs><filter id="filter0_b_674_19294" x="-9.26002" y="-9.26002" width="39.4853" height="50.4673" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feGaussianBlur in="BackgroundImageFix" stdDeviation="4.63001"></feGaussianBlur><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_674_19294"></feComposite><feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_674_19294" result="shape"></feBlend></filter></defs></svg><span>Twiggy</span></li>
          <li className='corporation'> © 2024 AlpheNex Technologies... </li>
        </ul>
        <ul>
          <li><h5>Company</h5></li>
          <li className='corporation'>About</li>
          <li className='corporation'>Careers</li>
          <li className='corporation'>Team</li>
          <li className='corporation'>Streamifies one</li>
          <li className='corporation'>Streamifies instamart</li>
          <li className='corporation'>Streamifies Genie</li>
        </ul>
        <ul>
          <li><h5>Contact Us</h5></li>
          <li className='corporation'>Help & Support</li>
          <li className='corporation'>Partner With Us</li>
          <li className='corporation'>Ride with Us</li>
          <ol>
            <li><h5>Legal</h5></li>
            <li className='corporation'>Terms & Condition</li>
            <li className='corporation'>Cookies Policy</li>
            <li className='corporation'>Privacy Policies</li>
            <li className='corporation'>Investor Relations</li>
          </ol>
        </ul>
        <ul>
          <li><h5>Our services are Used Widely in :</h5></li>
          <li className='corporation'>Delhi</li>
          <li className='corporation'>Gurgoan</li>
          <li className='corporation'>Noida</li>
          <li className='corporation'>Hyderabad</li>
          <li className='corporation'>Banglore</li>
          <li className='corporation'>Mumbai</li>
          <li className='corporation'>Pune</li>
          <li className='corporation'>589 More cities{dot}</li>
        </ul>
      </div>
      </body>
    </div>
  );
}

export default App;
