import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Animals from './pages/Animals'
import AnimalForm from './pages/AnimalForm'
import AnimalProfile from './pages/AnimalProfile'
import Calculator from './pages/Calculator'
import Learn from './pages/Learn'
import Breeds from './pages/Breeds'
import BreedDetail from './pages/BreedDetail'
import Genetics from './pages/Genetics'
import Feeding from './pages/Feeding'
import Health from './pages/Health'
import Myths from './pages/Myths'
import MythDetail from './pages/MythDetail'
import Glossary from './pages/Glossary'
import Weather from './pages/Weather'
import Saved from './pages/Saved'
import More from './pages/More'
import Settings from './pages/Settings'
import Sources from './pages/Sources'
import NotFound from './pages/NotFound'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Terms from './pages/Terms'
import { useAuth } from './lib/auth'

/** Redirects signed-out visitors to sign in before they can manage farm records. */
function MemberRoute() {
  const { member } = useAuth()
  const location = useLocation()
  return member ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

/** Declares the app's routes inside the shared page layout. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
        <Route path="signin" element={<Navigate to="/login" replace />} />
        <Route path="signup" element={<Navigate to="/register" replace />} />
        <Route path="terms" element={<Terms />} />
        <Route element={<MemberRoute />}>
          <Route path="animals" element={<Animals />} />
          <Route path="animals/new" element={<AnimalForm />} />
          <Route path="animals/:id" element={<AnimalProfile />} />
          <Route path="animals/:id/edit" element={<AnimalForm />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="calculator" element={<Calculator />} />
        <Route path="learn" element={<Learn />} />
        <Route path="breeds" element={<Breeds />} />
        <Route path="breeds/:id" element={<BreedDetail />} />
        <Route path="genetics" element={<Genetics />} />
        <Route path="feeding" element={<Feeding />} />
        <Route path="health" element={<Health />} />
        <Route path="myths" element={<Myths />} />
        <Route path="myths/:id" element={<MythDetail />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="weather" element={<Weather />} />
        <Route path="saved" element={<Saved />} />
        <Route path="more" element={<More />} />
        <Route path="sources" element={<Sources />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
