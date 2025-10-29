export function initAuth() {
    try {
        const auth = localStorage.getItem("auth")
        return auth ? JSON.parse(auth) : null
    } catch (error) {
        console.error('解析認證數據失敗:', error)
        localStorage.removeItem("auth")
        return null
    }
}

export function setAuth(auth) {
    try {
        localStorage.setItem("auth", JSON.stringify(auth))
    } catch (error) {
        console.error('保存認證數據失敗:', error)
    }
}

export function removeAuth() {
    try {
        localStorage.removeItem("auth")
    } catch (error) {
        console.error('清除認證數據失敗:', error)
    }
}

export function getToken() {
    try {
        return localStorage.getItem("token")
    } catch (error) {
        console.error('獲取token失敗:', error)
        return null
    }
}

export function setToken(token) {
    try {
        localStorage.setItem("token", token)
    } catch (error) {
        console.error('保存token失敗:', error)
    }
}

export function removeToken() {
    try {
        localStorage.removeItem("token")
    } catch (error) {
        console.error('清除token失敗:', error)
    }
}