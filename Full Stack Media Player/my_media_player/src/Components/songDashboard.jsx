import './songDashboard.css'
import SpotifyWebPlayer from 'react-spotify-web-playback';
import { useToken } from '../tokenContext.js';
import React , {useState,useEffect} from 'react';
import { useLocation } from 'react-router-dom' ;
import axios from 'axios';

const SongDashboard = () => {
    const { AccessToken } = useToken() ;
    const [play, setplay] = useState(false) ;
    const [Song, setSong] = useState([]) ; // initializing with empty array...
    const [Recommendation, setRecommendation] = useState([]) ; // initializing with empty array...
    const [CurrectArtist, setCurrectArtist] = useState() ;
    useEffect(() => {setplay(true) }, [trackUri]) ;
    const currentLocation = useLocation() ; // initialized the useLocation hook...

    useEffect(() => {
      setCurrectArtist(currentLocation.state) ;
      gettingSongsAndRecommendation() ; // triggering the songs of the artist and recommendation for user...
    }, [currentLocation.state])

    const gettingSongsAndRecommendation = async () => {
      const response = await axios.get('/api/user/songsandRecomendation',{params: {artist: CurrectArtist }}) ;
      setSong(response.data.songs) ;
      setRecommendation(response.data.recommendations) ;
    }
    
    const randIndexForVisualizer = Math.floor(1 + 9 * Math.random()) ;
    return (
    <>
    <div className='left'>
      <div id='innerdiv'>
        <span><img src="/Images/Discovery.Icon.png" alt="YM" /><div>your Music</div></span>
        <hr />
        <ul>
          <li>favourite</li>
          <li>listen-later</li>
          <li>history</li>
          <li>podcasts</li>
        </ul>
        <span><img src="/Images/Playlist.Icon.png" alt="PL" /><div>your Playlists</div></span>
        <hr />
        <ul>
          <li>metalcore</li>
          <li>electro</li>
          <li>funk</li>
          <li>disco</li>
        </ul>
          <div className='buttondiv'><button type="button"><div>create Playlist</div><img id='plus' src="/Images/plus.png" alt="Plus Icon" /></button></div>
      </div>
    </div>
    <div className="rightsection"><div><img src="https://th.bing.com/th/id/OIP.fqjUor46x2bCBHn2tFgY9gHaEK?w=321&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="artistrackbanner" /></div><img id='artistIMG' src="https://th.bing.com/th/id/OIP._XqNiuZWI44-tXrlYhl_UQHaHa?w=198&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="artistimg" /></div>
    <div className='mainsongsection'>
      {Song.map((song, index) => (
        <div className='songcard' key={index}>
          <ul>
            <li>
              <img src={song.coverImage} alt="Song Cover" />
            </li>
            <li>{song.title} <strong>|</strong></li>
            <li>by {song.artist} <strong>|</strong></li>
            <li>from album {song.album} <strong>|</strong></li>
            <li>Duration: {song.duration} <strong>|</strong></li>
            <li>Genre: {song.genre}</li>
            <li><img id='playicon' src="/Images/play-button.png" alt="button" /></li>
          </ul>
        </div>
      ))}
    </div>
    <div className='artistOptions'>
      <div><b>Recommended Artists For You...</b></div>
      {Recommendation.map((artist, index) => (
        <div className="optionCard" key={index}>
          <ul>
            <li><img src={artist.image} alt="artistimage" /></li>
            <li>{artist.name} <strong>|</strong></li>
            <li>{artist.location}</li>
          </ul>
        </div>
      ))}
    </div>
    <div className='controllerSection'>
      {
        AccessToken && (
        <SpotifyWebPlayer
          className="player"
          token={AccessToken}
          showSaveIcon
          showPreviousButton
          showNextButton
          play={play}
          callback={(state) => { if(!state.isPlaying) setplay(false) }}
          styles={{
            width: '100%',
            height: '100%',
            bgColor:'black',
            color:'grey',
            trackNameColor:'white',
            trackArtistColor:'white',
            sliderColor:'blue',
            sliderTrackBorderRadius:'10px',
            sliderTrackHeight:'5px',
            sliderHandleColor:'white',
            sliderTrackColor:'grey'
          }}/>
        )}
    </div>
    </>
  )
}

export default SongDashboard ;
