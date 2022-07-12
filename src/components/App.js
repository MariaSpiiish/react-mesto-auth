import { useEffect, useState } from 'react';
import { api } from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
// import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';
import AddPlacePopup from './AddPlacePopup';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: ''});
  const [cards, setCards] = useState([]);

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
    setSelectedCard({});
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
            <Header />
            <Main onEditAvatar={setIsEditAvatarPopupOpen} onEditProfile={setIsEditProfilePopupOpen} onAddPlace={setIsAddPlacePopupOpen} onCardClick={setSelectedCard} onCardLike={handleCardLike} onCardDelete={handleCardDelete} cards={cards}/>
            
            <Footer />

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
