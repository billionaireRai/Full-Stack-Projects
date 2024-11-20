import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../components/Account.css';
import { useUser } from '../UserContext';

const Account = () => {
  const { user , setUser } = useUser();
  const profileForm = useForm();
  const updateForm = useForm();
  const [Show, setShow] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user !== null) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user]);

  const handleUploadClick = () => {
    setIsPopupVisible(true);
  };

  const handleFileChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveClick = async () => {
    if (window.confirm("Sure you want to remove your profile pic?")) {
      await fetch('http://localhost:4000/removepic', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: user.PhoneNumber,
      });
      setProfileImage(null);
    }
  };

  const handleApply = async (data) => {
    const formData = new FormData();
    formData.append('File', data.File[0]);
    formData.append('PhoneNumber', user.PhoneNumber);
    try {
      const response = await fetch('http://localhost:4000/applypic', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok)    throw new Error('Network response was not ok') ;
      const result = await response.json();
      await setUser(result) ;
    } catch (error) {
      console.log(`error: ${error.message}`);
    }
  };

  const handleSave = async (data) => {
    const payload = {
      userPhoneNumber: user.PhoneNumber,
      updates: data,
      UpdateDate:new Date() 
    };
    await fetch('http://localhost:4000/applychanges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    setIsEditing(false);
  };
// Client-side code
async function handleDelete() {
  try {
    await fetch('http://localhost:4000/user/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ PhoneNumber: user.PhoneNumber }),
    });
    setShow(false);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <>
      {!Show ? (
        <div className="Wrapper">
          <div id="Box">
            <div id="Top">We didn’t find your Account !!!</div>
            <span id="Low">Please either Sign In OR Log In to Access your account...</span>
          </div>
        </div>
      ) : (
        <div className='MyAccount'>
          <div className='first'>
            <div className='IMGcontainer'>
              <img src={profileImage || user.ProfileImgURL[5]} alt="" />
            </div>
            <button onClick={handleUploadClick} type="button">Upload Pic</button>
            <button onClick={handleRemoveClick} type="button">Remove Pic</button>
          </div>
          <div className='second'>
            <h1>Account Details</h1>
            <form onSubmit={updateForm.handleSubmit(handleSave)} action='' method="post">
              <ul>
                <li>
                  <div>UserName</div>
                  <input {...updateForm.register('UserName')} className='INP' disabled={!isEditing} type="text" defaultValue={user.UserName} />
                </li>
                <li>
                  <div>Password</div>
                  <input {...updateForm.register('Password')} className='INP' disabled={!isEditing} style={{ overflow: 'hidden' }} type="password" defaultValue={user.Password} />
                </li>
                <li>
                  <div>Age</div>
                  <input {...updateForm.register('Age')} className='INP' disabled={!isEditing} type="number" defaultValue={user.Age} />
                </li>
                <li>
                  <div>Phone No.</div>
                  <input {...updateForm.register('PhoneNumber')} className='INP' disabled={!isEditing} type="number" defaultValue={user.PhoneNumber} />
                </li>
                <li>
                  <div>Address</div>
                  <input {...updateForm.register('Address')} className='INP' disabled={!isEditing} type="text" defaultValue={user.Address} />
                </li>
                <li>
                  <div>Sign In Date</div>
                  <input className='INP_DC' disabled type="text" defaultValue={user.SignInDate} />
                </li>
                <li>
                  <div>Last Update</div>
                  <input className='INP_DC' disabled type="text" defaultValue={user.UpdateDate} />
                </li>
                <li>
                  <div>Favourite Food Categories</div>
                  <input {...updateForm.register('FoodInterest')} className='INP' disabled={!isEditing} type="text" defaultValue={user.FoodInterest} />
                </li>
              </ul>
              <div className='Buttons'>
                <li><button onClick={() => setIsEditing(true)} id='SC' type="button">Make Changes</button></li>
                <li><button id='C' type="submit">Save Changes</button></li>
                <li><button onClick={handleDelete} id='DA' type="button">Delete Account</button></li>
              </div>
            </form>
          </div>
        </div>
      )}
      {isPopupVisible && (
        <div id='ProfilePop'>
          <div id='ProfileBox'>
            <h2>Upload Profile Pic</h2>
            <div className='IMG2container'>
              <img src={profileImage} alt="" />
            </div>
            <form onSubmit={profileForm.handleSubmit(handleApply)} encType='multipart/form-data' action="" method="post">
              <input {...profileForm.register('File', { required: true })} name='File' onChange={handleFileChange} id='ProfilePic' type="file" accept='image/*' />
              <li><button id='SC' type="submit">Apply</button></li>
              <li><button onClick={() => setIsPopupVisible(false)} id='DA' type="button">Close</button></li>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
