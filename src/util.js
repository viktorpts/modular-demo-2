export function createSubmitHandler(callback) {
    return function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
    
        callback(data, event.target);
    };
}

export function setUserData(data) {
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('_id', data._id);
    sessionStorage.setItem('accessToken', data.accessToken);
}

export function getUserData() {
    if (sessionStorage.getItem('accessToken') == null) {
        return null;
    } else {
        return {
            email: sessionStorage.getItem('email'),
            username: sessionStorage.getItem('username'),
            _id: sessionStorage.getItem('_id'),
            accessToken: sessionStorage.getItem('accessToken')
        };
    }
}

export function clearUserData() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('_id');
    sessionStorage.removeItem('accessToken');
}