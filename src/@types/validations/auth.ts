export interface RegisterBody {
        name:     string
        email:    string
        password: string
}

export interface LoginBody {
        email:    string
        password: string
}

export interface LogoutBody {
    email:        string
    refreshToken: string
}

export interface OAuthBody {
        access_token: string
}

// POST /v1/auth/refresh
export interface RefreshBody {
        email:        string
        refreshToken: string
}

// POST /v1/auth/refresh
export interface SendPasswordResetBody {
        email: string
}

// POST /v1/auth/password-reset
export interface PasswordResetBody {
        email:      string
        password:   string
        resetToken: string
}
