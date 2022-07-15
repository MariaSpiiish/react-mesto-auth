import { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { api } from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import RegistrationResult from './RegistrationResult';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';
import { auth } from '../utils/Auth';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: ''});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const [ownerEmail, setOwnerEmail] = useState('');

  useEffect(() => {
    const checkToken = () => {
      if(localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        if(token) {
          auth.getToken(token)
            .then((res) => {
              const email = res.data.email;
              setOwnerEmail(email);
              setIsLoggedIn(true);
              history.push("/react-mesto-auth");
            })
        }
      }
    }
    checkToken();
  }, [history]);


  useEffect(() => {
    api.getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log(`Ошибка в загрузке текущего пользователя: ${err}`);
      });
  }, []);

  useEffect(() => {
    api.getCards()
      .then(setCards)
      .catch((err) => {
        console.log(`Ошибка в загрузке данных карточек: ${err}`);
      });
  }, [])

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoPopupOpen(false);
    setSelectedCard({});
  }

  const handleRegistration = (data) => {
    auth.register(data.email, data.password)
        .then((res) => {
            if(res) {
              handleRegistrationResult(true)
            }
        })
        .catch((err) => {
          handleRegistrationResult(false)
          console.log(`Ошибка в регистрации пользователя: ${err}`);
        });

    // history.push("/sign-in");
  }

  const handleRegistrationResult = (result) => {
    setIsRegistrationSuccessful(result);
    setIsInfoPopupOpen(true);
  }

  const handleLogin = (data) => {
    auth.authorize(data.email, data.password)
      .then((data) => {
          if (data.token){
              localStorage.setItem('token', data.token);
              setIsLoggedIn(true);
              history.push("/react-mesto-auth");
          }
      })
      .catch((err) => {
        handleRegistrationResult(false)
        console.log(`Пользователь не найден: ${err}`);
      });
  }

  const handleUpdateUser = (currentUser) => {
    api.patchUserInfo(currentUser)
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })
      .catch((err) => {
        console.log(`Ошибка в обновлении данных пользователя: ${err}`);
      });
  }

  const handleUpdateAvatar = (currentUser) => {
    api.patchUserAvatar(currentUser)
      .then((userAvatar) => {
        setCurrentUser(userAvatar)
      })
      .catch((err) => {
        console.log(`Ошибка в обновлении аватара пользователя: ${err}`);
      });
  }

  const handleAddPlace = (card) => {
    api.postNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]); 
      })
      .catch((err) => {
        console.log(`Ошибка в обновлении новой карточки: ${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.setCardLike(card._id, (!isLiked ? 'PUT' : 'DELETE'))
      .then((newCard) => {
        setCards(stateCards => {
          return stateCards.map((c) => (
            c._id === card._id ? newCard : c
          ))
        })
      })
      .catch((err) => {
        console.log(`Ошибка в постановке лайка: ${err}`);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card, card._id)
      .then(() => {
        setCards(cards.filter((c) => {
          return c._id !== card._id
        }))
      })
      .catch((err) => {
        console.log(`Ошибка в удалении карточки: ${err}`);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="page-container">
          <div className="page">
            
            <Switch>
              <ProtectedRoute 
                  onEditAvatar={setIsEditAvatarPopupOpen} 
                  onEditProfile={setIsEditProfilePopupOpen} 
                  onAddPlace={setIsAddPlacePopupOpen} 
                  onCardClick={setSelectedCard} 
                  onCardLike={handleCardLike} 
                  onCardDelete={handleCardDelete} 
                  cards={cards}
                  ownerEmail={ownerEmail} 
                  path="/react-mesto-auth"
                  loggedIn={isLoggedIn}
                  component={Main}
              />

              <Route path="/sign-in">
                <Header redirect={() => history.push("/sign-up")} buttonText="Регистрация" />
                <Login onLogin={handleLogin}/>
              </Route>

              <Route path="/sign-up">
                <Header redirect={() => history.push("/sign-in")} buttonText="Войти" />
                <Register onRegister={handleRegistration}/>
              </Route>

              <Route exact path="/">
                {isLoggedIn ? <Redirect to="/react-mesto-auth" /> : <Redirect to="/sign-in" />}
              </Route>
            
            </Switch>
            <Footer />

            <RegistrationResult isOpen={isInfoPopupOpen} onClose={closeAllPopups} isSuccessful={isRegistrationSuccessful}/>
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/> 
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />

            <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

            {/* 

            <div className="popup popup_type_trash">
              <div className="popup__trash-container">
                <button type="button" className="popup__close-button popup__close-button_type_trash"></button>
                <form name="trash" className="form trash-form" novalidate>
                  <h2 className="popup__title">Вы уверены?</h2>
                  <button type="submit" className="popup__submit-button popup__submit-button_type_trash opacity">Да</button>
                </form>
              </div>
            </div> */}
            
          </div>
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>  
  );
}

export default App;
