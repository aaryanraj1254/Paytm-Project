function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}











// Adding routing to a React app allows you to show different pages when users go to different URLs, like /signup or /dashboard.

// The code in App.jsx does this:

// <BrowserRouter> – Wraps your app to enable routing.
// <Routes> – Holds all your page routes.
// <Route path="/signup" element={<Signup />}/> – Shows the Signup page when the user goes to /signup.
// What happens?
// When the user goes to /signup, they see the Signup page.
// When they go to /signin, they see the Signin page.
// It helps to switch pages without reloading the website!