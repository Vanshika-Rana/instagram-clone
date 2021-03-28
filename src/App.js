import React, {useEffect, useState} from 'react';
import './App.css';
import Post from './Post';
import Modal from '@material-ui/core/Modal';
import { auth, db } from './firebase';
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  }));
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
   
  // UseEffect -> Runs a specific code based on a specific conditions
  useEffect(() => {
    const  unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in...
        console.log(authUser);
        setUser(authUser);

      }
      else {
        //user logged out....
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    //code runs here
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //everytime a post is added, this above code is fired ....
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName:username
        })
      })
      .catch((error) => alert(error.message));
    
      setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    
      setOpenSignIn(false)

  }
  

  return (
    <div className="app">
      
     <Modal
        open={open}
        onClose={() => setOpen(false)}
      >

        <div style={modalStyle} className={classes.paper}>
          <center>
            <h2 className="app__headertext">Instagram</h2>
          </center>
          <form className="app__signup">
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
            

          
      </div>
      </Modal>

      <Modal className="modal"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >

        <div  style={modalStyle} className={classes.paper}>
          <center>
            <h2 className="app__headertext">Instagram</h2>
          </center>
          <form className="app__signup">
            
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
            

          
      </div>
      </Modal>

      <div className="app__header">
        <h2 className="app__headertext">Instagram</h2>
        {user ? (
        <Button onClick={() => auth.signOut()}> Logout</Button>
      ) : (
          <div className="app__logincontainer">
            <Button onClick={() => setOpenSignIn(true)}> Sign In</Button>
            <Button onClick={() => setOpen(true)}> Sign Up</Button>
          </div>


        
      )}
      </div>

      <div className="app__posts">

      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imgUrl={post.imgUrl}/>

        ))
        }
      </div>
      
       {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Sorry! Please login to upload </h3>
      
      )}
      


     
    </div>
  );
}

export default App;
