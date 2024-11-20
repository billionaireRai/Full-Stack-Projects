import '../components/TraceLocation.css'
import React,{useState} from 'react'
import { useForm } from 'react-hook-form';

// I will include the GoogleMaps API at the end...

const TraceLocation = () => {
  const InputForm = useForm() ;
    const [dot, setdot] = useState('');
    setInterval(() => {
        setdot((prevDot) => prevDot.length < 4 ? (prevDot + '.') : ''); 
      }, 1000); // Adjust the timing of dots if needed

      const NetworkDelay = (t) => { 
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve() ;
          }, t * 1000);
        })
       }
    async function onsubmit(InputData) {
      await NetworkDelay(3) ;
      // Making request to the server...
      try {
        const response = await fetch('http://localhost:4000/UserInfo',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(InputData)
      })
      if (response.ok) {
        const result = response.json() ;
        console.log('Input Data :' , result);
      } else {
        console.log("Failed response...")
      }
      } catch (error) {
        console.log("Some error occured in making request :",error); 
      }
    }
  return (
    <> 
    <div className='MainSection'>
      <div className='Left'>
        <h2>Tracked Information{InputForm.formState.isSubmitting ? dot : ''}</h2>
        <div className='TrackedInfo'>
          <div>Tracked_Location_1 :{}</div>
          <div>Tracked_Coordinate_1 :{}</div>
          <div>Tracked_Location_2 :{}</div>
          <div>Tracked_Coordinate_2 :{}</div>
          <div>Tracked_Distance :{}</div>
        </div>
        <h2 id='TM'>Targeted Map</h2>
        <div id="Map">

        </div>
      </div>
      <div className='Right'>
        <video> 
         <source src="videos\vecteezy_searching-radar-hud-screen-animation-digital-technology_25455503.mp4" type="video/mp4" />
      </video>
      <div className='lower'>
        <ul>
            <div>Please Enter The Phone Numbers( International Format ) You Wanna Track</div>   
            <form onSubmit={InputForm.handleSubmit(onsubmit)} action="" method="post">
              <li>
                <label htmlFor="PhoneNumber_1">First Phone_Number : </label>
                <input placeholder='Enter first phone number' type="number" {...InputForm.register('PhoneNo_1',{required:{value:true , message:'One of the neccessary details...'}, minLength:{value: 9 , message:'Minimum lenght should be 9 digits...' }, maxLength:{value: 11 , message:'Maximum lenght should be 11 digits...'} })} />
                {InputForm.formState.errors.PhoneNo_1 && (<span className="error">{InputForm.formState.errors.PhoneNo_1.message}</span>)}
              </li>
              <li>
              <label htmlFor="PhoneNumber_2">Second Phone_Number : </label>
              <input placeholder='Enter second phone number' type="number" {...InputForm.register('PhoneNo_2',{required:{value:true , message:'One of the neccessary details...'}, minLength:{value: 9 , message:'Minimum lenght should be 9 digits...' }, maxLength:{value: 11 , message:'Maximum lenght should be 11 digits...'} })}  />
              {InputForm.formState.errors.PhoneNo_2 && (<span className="error">{InputForm.formState.errors.PhoneNo_2.message}</span>)}
              </li>
              <li>
              <button disabled={InputForm.formState.isSubmitting} type="submit">Track Location</button>
              </li>
            </form>
        </ul>
      </div>
      </div>
    </div>
    </>
  )
}

export default TraceLocation
