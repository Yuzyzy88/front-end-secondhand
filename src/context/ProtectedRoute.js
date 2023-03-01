import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    // const { getToken } = UserAuth();
    const Token =  localStorage.getItem('Auth Token')

    if (!Token) {
        return <Navigate to="/login" />;
    }

    return children;
}

const PublicRoute = ({ children }) => {
    // const { getToken } = UserAuth();
    const Token =  localStorage.getItem('Auth Token')
    if (Token) {
        return <Navigate to='/' replace />
    }
    return children
}

const SpecialRoute = ({ children }) => {
    const { isEmptyProfile } = UserAuth();
    const isEmpty = (isEmptyProfile() === 'true') ? true : false

    if (isEmpty) {
        window.alert('Tolong Lengkapi Info Akun Sebelum Transaksi ')
        return <Navigate to='/profile' replace />
    } 

    return children
}

export { SpecialRoute, PublicRoute, ProtectedRoute }
