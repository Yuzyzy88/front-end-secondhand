import { createContext, useContext, useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence,
    sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axios'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from 'react-redux'
import { createNotification } from "../slices/notificationSlice";

const UserContext = createContext()
const provider = new GoogleAuthProvider()

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate()

    const createUser = (email, password, displayName) => {
        return createUserWithEmailAndPassword(auth, email, password).then(
            (userCredential) => {
                axiosInstance.post('register', {
                    uid: userCredential.user.uid,
                    name: displayName
                })

                sendEmailVerification(auth.currentUser)
                navigate('/login')
            })
    }

    const [messageNegotiation, setmessageNegotiation]  = useState("")
    const createNegotiation = (buyerUID, sellerUID, productID, price) => {
        return axiosInstance.post('negotiation', {
            'buyer_uid': buyerUID,
            'seller_uid': sellerUID,
            'product_uid': productID,
            'price': price,
            'isApproved': 1
        }).then((res) => {
            window.alert('Penawaranmu berhasil terkirim')
            navigate('/list')
        })
    }

    const [messageProduct, setmessageProduct]  = useState("")
    const updateNegotiation = (id, negotiationStatus) => {
        return axiosInstance.patch('negotiation', {
            'id': id,
            'isApproved': negotiationStatus
        })
    }

    const UpdateProductStatus = async (productid) => {
        return axiosInstance.patch('product', {
            'id': productid,
            'isAvailable': false 
        })
    }

    const dispatch = useDispatch()
    const createProduct = async (name, price, category, description, images) => {
        const storage = getStorage();
        // Upload images to firestore
        const imageUrls = [];
        for (const file of images) {
            const storageRef = ref(storage, `item-pics/${auth.currentUser.uid}/${file.id}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file)
            let url = await getDownloadURL(snapshot.ref)
            imageUrls.push(url)
        }

        const data = {
            'uid': auth.currentUser.uid,
            'name': name,
            'price': price,
            'category': category,
            'description': description,
            'isAvailable': true,
            'images': imageUrls,
        }
        await axiosInstance.post('product', data).then((res) => {
            if (res.status === 200) {
                setmessageProduct("Product berhasil ditambahkan!")
                setTimeout(() => {
                    setmessageProduct("")
                    navigate('/list')
                  },3000)
            } else {
                setmessageProduct("Product tidak ditambahkan!")
            }
        })

        const today =new Date()
        dispatch(createNotification({
            "toId": auth.currentUser.uid,
            "readStatus": false,
            "date": today.toISOString(),
            "productName": name,
            "productPrice": price,
            "imgurl": imageUrls[0]
        }))
    }

    const [messageUpdate, setmessageUpdate]  = useState("")
    const UpdateProduct = async (id, name, price, category, description,oldImageUrls, newImages) => {
        const storage = getStorage()

        // Upload images to firestore
        const imageUrls = [];
        for (const file of newImages) {
            const storageRef = ref(storage, `item-pics/${auth.currentUser.uid}/${file.id}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file)
            let url = await getDownloadURL(snapshot.ref)
            imageUrls.push(url)
        }

        const data = {
            'uid': auth.currentUser.uid,
            'name': name,
            'price': price,
            'category': category,
            'description': description,
            'images': [...oldImageUrls, ...imageUrls]
        }
        axiosInstance.patch(`product/${id}`, data)
        setTimeout(() => {
            navigate('/list')
        }, 1000);
        window.alert('Product Berhasil Di Update')
    }

    const [messageAcc, setmessageAcc]  = useState("")
    const updateAccountProfile = async (displayName, city, address, phone, image) => {
        let url = auth.currentUser.photoURL
        if (image) {
            const storage = getStorage();
            const storageRef = ref(storage, `item-pics/${auth.currentUser.uid}/${image.name}`)
            const snapshot = await uploadBytes(storageRef, image)
            url = await getDownloadURL(snapshot.ref)
        }

        return updateProfile(auth.currentUser, { displayName: displayName, photoURL: url }).then(() => { 
            const data = {
                'uid': auth.currentUser.uid,
                'name': displayName,
                'city': city,
                'address': address,
                'phone': phone,
                'image': url
            }
            axiosInstance.patch('profile', data).then((res) => {
                if (res.status === 200) {
                    setTimeout(() => {
                        setmessageAcc("")
                        navigate('/list')
                    }, 3000)
                    setmessageAcc("Profile telah dilengkapi!")
                } else {
                    setmessageAcc("Profile gagal diupdate!")
                }
            })
        })
    }

    const signIn = (email, password) => {
        setPersistence(auth, browserLocalPersistence).then(() => {
            return signInWithEmailAndPassword(auth, email, password).then((res) => {
                navigate('/')
            }).catch((err) => {
                window.alert(err.message)
            })
        })
    }

    const signInWithGoogle = () => {
        return signInWithPopup(auth, provider).then(async (result) => {
            axiosInstance.post('register', {
                uid: result.user.uid,
                name: result.user.displayName,
                image: result.user.photoURL
            })
            navigate('/') 
            // window.location.reload()  
            localStorage.setItem('IsEmptyProfile', await checkEmptyProfile())
            localStorage.setItem('User Data', JSON.stringify(await getProfile()))         
        }).catch((err) => {
            window.alert(err);
        })
    }

    const updatePassword = (email) => {
        return sendPasswordResetEmail(auth, email).then(() => {
            window.alert("Check Your Email For Further Instruction")
            navigate('/login')
        })
    }

    const logout = () => {
        return signOut(auth).then(() => {
            localStorage.clear()
            navigate('/login')
        })
    }

    const checkEmptyProfile = async () => {
        const profile = (await axiosInstance.get('profile')).data;
        if (profile.name && profile.name !== '' &&
            profile.city && profile.city !== '' &&
            profile.address && profile.address !== '' &&
            profile.phone && profile.phone !== '') {
            return false
        } else {
            return true
        }
    }

    const getProfile = async () => {
        return (await axiosInstance.get('profile')).data;
    }

    const getToken = () => {
        return localStorage.getItem('Auth Token')
    }

    const isEmptyProfile = () => {
        return localStorage.getItem('IsEmptyProfile')
    }

    const getUserDatabase = () => {
        return JSON.parse(localStorage.getItem("User Data"));
    }

    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser)
            currentUser.getIdToken().then(async (token) => {
                localStorage.setItem('Auth Token', token)
                localStorage.setItem('IsEmptyProfile', await checkEmptyProfile())
                localStorage.setItem('User Data', JSON.stringify(await getProfile()))
            })

            if (!currentUser.emailVerified) {
                window.alert("Please Check Your Email To Verify Your Account!!")
                logout()
            }
        })

        return () => {
            unsubcribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{
            messageProduct,
            messageNegotiation,
            messageAcc,
            messageUpdate,
            getProfile,
            createUser,
            logout,
            getUserDatabase,
            signIn,
            getToken,
            UpdateProductStatus,
            signInWithGoogle,
            createNegotiation,
            updateNegotiation,
            updateAccountProfile,
            updatePassword,
            isEmptyProfile,
            createProduct,
            UpdateProduct,
            //createNotification
        }}>
            {children}
        </UserContext.Provider >
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}
