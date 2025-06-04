import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/layouts/AuthLayout';
import SignInPage from './pages/auth/SignInPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import PasscodePage from './pages/auth/PasscodePage';
import WelcomePage from './pages/WelcomePage';
import BlankPage from './pages/BlankPage';
import ProfileBuilder from './pages/ProfileBuilder';
import BasicDetailsCard from './pages/profile/BasicDetailsCard';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthRoute from './components/auth/AuthRoute';

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/auth/signin" replace />} />
        <Route element={<AuthRoute />}>
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/verify" element={<VerifyEmailPage />} />
          <Route path="/auth/passcode" element={<PasscodePage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/blank" element={<BlankPage />} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/profile/basic-details" element={<BasicDetailsCard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;