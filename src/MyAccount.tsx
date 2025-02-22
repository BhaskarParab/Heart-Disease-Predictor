"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { AccountCircle, Email, Wc, Cake, Edit, Save } from "@mui/icons-material"
import './MyAccount.css';

interface User {
  username: string
  email: string
  gender: string
  dob: string
  photoURL: string | null
  isGoogleUser: boolean
}

const MyAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newUsername, setNewUsername] = useState<string>("")

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth()
      setLoading(true)

      try {
        const currentUser = auth.currentUser
        if (currentUser) {
          const isGoogleUser = currentUser.providerData.some((provider) => provider.providerId === "google.com")

          const db = getFirestore()
          const userRef = doc(db, "users", currentUser.uid)
          const docSnap = await getDoc(userRef)

          if (docSnap.exists()) {
            const userData = docSnap.data()
            setUser({
              username: userData.username || currentUser.displayName || "N/A",
              email: currentUser.email || "N/A",
              gender: userData.gender || "N/A",
              dob: userData.dob || "N/A",
              photoURL: currentUser.photoURL || null,
              isGoogleUser,
            })
            setNewUsername(userData.username || currentUser.displayName || "")
          } else {
            setUser({
              username: currentUser.displayName || "N/A",
              email: currentUser.email || "N/A",
              gender: "N/A",
              dob: currentUser.metadata.creationTime || "N/A",
              photoURL: currentUser.photoURL || null,
              isGoogleUser,
            })
            setNewUsername(currentUser.displayName || "")
          }
        } else {
          setError("User not authenticated.")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to fetch user data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    if (!user || user.isGoogleUser) return

    const auth = getAuth()
    const currentUser = auth.currentUser

    if (currentUser) {
      try {
        const db = getFirestore()
        const userRef = doc(db, "users", currentUser.uid)

        await updateDoc(userRef, {
          username: newUsername,
        })

        setUser((prev) => (prev ? { ...prev, username: newUsername } : null))
        setIsEditing(false)
      } catch (error) {
        console.error("Error updating username:", error)
        setError("Failed to update username. Please try again.")
      }
    }
  }

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  return (
    <div
      id="webcrumbs"
      // className="w-[1200px] bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-2xl p-8 relative overflow-hidden"
    >
      {/* <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-5 bg-cover bg-center" />
      <div className="animate-pulse absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-20" />
      <div className="animate-pulse absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-20" /> */}

      <div className="mb-10 space-y-4 relative">
        <h2 className="text-2xl text-gray-600 text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Healthcare History Analytics
        </h2>
        <div className="w-[800px] mx-auto">
          <section className="bg-gradient-to-br from-indigo-100 to-purple-50 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <div className="relative mb-8">
              <h1 className="text-4xl font-bold text-center relative z-10">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600 transition-all duration-500">
                  My Profile
                </span>
              </h1>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-20 z-0 animate-pulse" />
            </div>

            {user && (
              <div className="relative group transform hover:scale-[1.01] transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                  <div className="flex items-center justify-center mb-6 relative">
                    <div className="absolute w-32 h-32 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-400 ring-offset-4 ring-offset-white hover:scale-105 transition-transform duration-300 relative z-10">
                      <img
                        src={user.photoURL || "https://api.dicebear.com/6.x/avataaars/svg?seed=Felix"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 hover:bg-indigo-50/80 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                      <AccountCircle className="text-indigo-600 animate-bounce" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-500">Username</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="text-lg font-semibold text-gray-800 bg-transparent border-b border-indigo-300 focus:outline-none focus:border-indigo-600"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                        )}
                      </div>
                      {!user.isGoogleUser &&
                        (isEditing ? (
                          <Save
                            onClick={handleSaveClick}
                            className="text-purple-600 cursor-pointer hover:scale-110 transition-transform rotate-0 hover:rotate-180"
                          />
                        ) : (
                          <Edit
                            onClick={handleEditClick}
                            className="text-purple-600 cursor-pointer hover:scale-110 transition-transform rotate-0 hover:rotate-180"
                          />
                        ))}
                    </div>

                    <div className="flex items-center space-x-4 p-3 hover:bg-indigo-50/80 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                      <Email className="text-indigo-600" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 hover:bg-indigo-50/80 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                      <Wc className="text-indigo-600" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="text-lg font-semibold text-gray-800">{user.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 hover:bg-indigo-50/80 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                      <Cake className="text-indigo-600" />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="text-lg font-semibold text-gray-800">{user.dob}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
    //   </div>
    // </div>
  )
}

export default MyAccount