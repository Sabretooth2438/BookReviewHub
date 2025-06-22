import Header from '../components/layout/Header'
import ResetPw from '../components/ResetPw'

const Profile = () => (
  <>
    <Header />
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account settings</h1>
      <ResetPw />
    </main>
  </>
)

export default Profile
