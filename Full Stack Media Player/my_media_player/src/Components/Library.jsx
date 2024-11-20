import './Library.css';
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';

const Library = () => {
  useEffect(() => {
    const toAuthenticateSpotify = async () => {
       await axios.post('/api/spotify/authorize', null ,{withCredentials:true}) 
    }
   toAuthenticateSpotify();
  }, [])

  return (
    <>
      <div id='WrapperTop'>
        <div className='Left'>
          <div id='fdd'>
            <img src="/Images/LibraryIcon.png" alt="Library Icon" />
            <b><span>Your Library</span></b>
            <img id='plus' src="/Images/plus.png" alt="Plus Icon" />
          </div>
          <div id='sdd'>
            <span>Create Your First Playlist...</span>
            <div>It's really easy, to create a playlist we'll help you in that.</div>
            <button className='CreatePlaylist'>Create Playlist</button>
          </div>
          <div id='sdd'>
            <span>Lets find Some Podcast to follow</span>
            <div>we'll keep you updated with your favourite Podcast categories</div>
            <button className='CreatePlaylist'>Browse Podcast</button>
          </div>
        </div>
        <div className='Right'>
          <div id='topsection'>
            <h3>Popular Artist Of Your Country</h3>
            <span><img src="/Images/BackArrow.png" alt="Back Arrow" /><img src="/Images/FrontArrow.png" alt="Front Arrow" /></span>
          </div>
          <div id='Artists'>
            <div className='card'>
              <img src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
            </div>
            <div className='card'>
              <img src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
            </div>
            <div className='card'>
              <img src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
            </div>
            <div className='card'>
              <img src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
            </div>
            <div className='card'>
              <img src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
            </div>
            <div className='card'>
              <img src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
            </div>
          </div>
          <div id='topsection'>
            <h3>Popular Albums</h3>
            <span><img src="/Images/BackArrow.png" alt="Back Arrow" /><img src="/Images/FrontArrow.png" alt="Front Arrow" /></span>
          </div>
          <div id='Artists'>
            <div className='card'>
              <img id='albumImg' src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='albumName artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
            <div className='card'>
              <img id='albumImg' src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='albumName artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
            <div className='card'>
              <img id='albumImg' src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='albumName artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
            <div className='card'>
              <img id='albumImg' src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='albumName artistName'>A.R Rehman</div>
              <img id='playbtn' src="/Images/play-button.png" alt='btn' />
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
            <div className='card'>
              <img id='albumImg' src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='albumName artistName'>A.R Rehman</div>
               <img id='playbtn' src="/Images/play-button.png" alt='btn' />
               <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
            <div className='card'>
              <img id='albumImg' src="https://images.squarespace-cdn.com/content/v1/5fc06f20a3bf4b14aba6cfd9/df749d4f-7fed-40dd-89ce-bb0eaa555797/Screen+Shot+2022-09-02+at+12.59.33+PM.png?format=1500w" alt="Artist" />
              <div className='albumName artistName'>A.R Rehman</div>
               <img id='playbtn' src="/Images/play-button.png" alt='btn' />
               <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Library;