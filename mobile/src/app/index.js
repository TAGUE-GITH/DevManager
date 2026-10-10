import { Redirect } from 'expo-router'
import { useAuth } from '../context/AuthProvider'

// Point d'entree : espace de travail si connecte, sinon ecran de connexion
export default function Index() {
  const { user } = useAuth()
  return <Redirect href={user ? '/home' : '/login'} />
}
