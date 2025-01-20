import './Library.css';
import axios from 'axios';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../tokenContext.js';
import { toast } from 'react-toastify';

const Library = () => {
  const [Artists, setArtists] = useState([]);
  const [Albums, setAlbums] = useState([]);
  const [Radiotracks, setRadiotracks] = useState([]);
  const { setAccessToken } = useToken();
  const navigate = useNavigate();

  const socket = new WebSocket('ws://localhost:4040');
  socket.onmessage = (event) => {
    const { accessToken } = JSON.parse(event.data);
    setAccessToken(accessToken);
  };

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/song-library&scope=streaming%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20user-top-read%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state`;
  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    if (!code) window.location.href = spotifyAuthUrl;
  }, []);

  const toGetDetails = async () => {
    const responseData = await axios.get('/api/spotify/homepage/getdetails');
    setArtists(responseData.data.artists);
    setAlbums(responseData.data.albums);
    setRadiotracks(responseData.data.radioTracks);
  };

  async function toSendAuthCode() {
    try {
      const response = await axios.post('/api/spotify/authcode', { authCode: code }, { withCredentials: true });
      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        toGetDetails();
      }
    } catch (error) {
      console.error("Error sending auth code:", error.response ? error.response.data.message : error.message);
    }
  }

  useEffect(() => {
    if (code) toSendAuthCode();
  }, [code]);

  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);

  const handleScroll = useCallback((ref) => {
    if (ref.current) ref.current.scrollBy({ left: 150, behavior: 'smooth' });
  }, []);

  const handlePreviousScroll = useCallback((ref) => {
    if (ref.current) ref.current.scrollBy({ left: -150, behavior: 'smooth' });
  }, []);

  const handleCardClick = useCallback((indexOfArray) => {
    console.log(indexOfArray);
    
    const choosenArtist = 
      indexOfArray < Artists.length ? Artists[indexOfArray].artistName :
      indexOfArray < Albums.length ? Albums[indexOfArray].albums[0].name :
      indexOfArray < Radiotracks.length ? Radiotracks[indexOfArray].name :
      null ;

    navigate('/user-musicdashboard', { state: { choosenArtist } });
  });

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
            <span><img onClick={() => { handlePreviousScroll(scrollRef1) }} src="/Images/BackArrow.png" alt="Back Arrow" /><img onClick={() => { handleScroll(scrollRef1) }} src="/Images/FrontArrow.png" alt="Front Arrow" /></span>
          </div>
          <div ref={scrollRef1} id='Artists'>
            {Artists.map((item, index) => (
              <div onClick={() => { handleCardClick(index) }} id={index} className='card' key={index}>
                <img id='artristImg' src={item.albumArt} alt="Artist" />
                <div className='albumName artistName'>{item.artistName}</div>
                <img id='playbtn' src="/Images/play-button.png" alt='btn' />
                <p>{item.artistName}</p>
              </div>
            ))}
          </div>
          <div id='topsection'>
            <h3>Popular Albums</h3>
            <span><img onClick={() => { handlePreviousScroll(scrollRef2) }} src="/Images/BackArrow.png" alt="Back Arrow" /><img onClick={() => { handleScroll(scrollRef2) }} src="/Images/FrontArrow.png" alt="Front Arrow" /></span>
          </div>
          <div ref={scrollRef2} id='Artists'>
            {Albums.map((item, index) => (
              <div onClick={() => { handleCardClick(index) }} id={index} className='card' key={index}>
                <img id='albumImg' src={item.albums[0].images[0].url} alt="Artist" />
                <div className='albumName artistName'>{item.albums[0].name}</div>
                <img id='playbtn' src="/Images/play-button.png" alt='btn' />
                <p>{item.albums[0].name}</p>
              </div>
            ))}
          </div>
          <div id='topsection'>
            <h3>Popular Radiotracks</h3>
            <span><img onClick={() => { handlePreviousScroll(scrollRef3) }} src="/Images/BackArrow.png" alt="Back Arrow" /><img onClick={() => { handleScroll(scrollRef3) }} src="/Images/FrontArrow.png" alt="Front Arrow" /></span>
          </div>
          <div ref={scrollRef3} id='Artists'>
            {Radiotracks.map((item, index) => (
              <div onClick={() => { handleCardClick(index) }} id={index} className='card' key={index}>
                <img id='radiotrackImg' src={item.images[0] ? item.images[0].url : "/Images/DefaultAlbumArt"} alt="Artist" />
                <div className='albumName artistName'>{item.name}</div>
                <img id='playbtn' src="/Images/play-button.png" alt='btn' />
                <p>{item.artistName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Library;
