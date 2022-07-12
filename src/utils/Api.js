class Api {
  constructor(options) {
      this.url = options.url;
      this.headers = options.headers;
  }

  _handleResponse(res) {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }

  getUserInfo() {
      return fetch(`${this.url}/users/me`, {
          headers: this.headers
        })
          .then(this._handleResponse)
  }

  patchUserInfo(data) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    .then(this._handleResponse)
  }

  patchUserAvatar(avatar) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(avatar)
    })
    .then(this._handleResponse)
  }

  getCards() {
      return fetch(`${this.url}/cards`, {
        headers: this.headers
      })
        .then(this._handleResponse)
  }

  postNewCard(data) {
      return fetch(`${this.url}/cards`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      })
      .then(this._handleResponse)
  }

  deleteCard(data, id) {
    return fetch(`${this.url}/cards/${id}`, {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    .then(this._handleResponse)
  }

  setCardLike(id, method) {
    return fetch(`${this.url}/cards/${id}/likes`, {
      method: method,
      headers: this.headers,
    })
    .then(this._handleResponse)
  }
}

  // putLike(id) {
  //   return fetch(`${this.url}/cards/${id}/likes`, {
  //     method: 'PUT',
  //     headers: this.headers,
      
  //   })
  //   .then(this._handleResponse)
  // }

  // deleteLike(id) {
  //   return fetch(`${this.url}/cards/${id}/likes`, {
  //     method: 'DELETE',
  //     headers: this.headers,
      
  //   })
  //   .then(this._handleResponse)
  // }


export const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-42',
  headers: {
    authorization: 'a9ef8c07-b83e-4444-b4dd-d87bd8a4730a',
    'Content-Type': 'application/json',
  }
})