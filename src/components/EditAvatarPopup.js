import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
    const inputRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();
      
        props.onUpdateAvatar({
          avatar: inputRef.current.value,
        });

        props.onClose();
        inputRef.current.value = '';
      } 
    
    return (
        <PopupWithForm title={'Обновить аватар'} name={'avatar'} buttonText={'Сохранить'} isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
            <input 
                name="avatar"
                id="avatar-link-input" 
                type="url" 
                required
                placeholder="https://somewebsite.com/someimage.jpg" 
                className="popup__input popup__input_type_pic-link"
                ref={inputRef}
            />
            <span id="avatar-link-error" className="avatar-link-input-error popup__error"></span>
        </PopupWithForm>
    )
} 

export default EditAvatarPopup;