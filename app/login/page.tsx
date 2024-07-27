
// import { login, signup } from '../login/actions';
// import './LoginPage.css';

// export default function LoginPage() {
//   return (
//     <div className="login-page">
//       <form>
//         <h2>Login</h2>
//         <label htmlFor="name">Name:</label>
//         <input id="name" name="name" type="text" required />
//         <label htmlFor="email">Email:</label>
//         <input id="email" name="email" type="email" required />
//         <label htmlFor="password">Password:</label>
//         <input id="password" name="password" type="password" required />
//         <button formAction={login}>Log in</button>
//         <button formAction={signup}>Sign up</button>
//       </form>
//     </div>
//   );
// }
import { login, signup } from '../login/actions';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <form>
        <h2>Login</h2>
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" type="text" required />
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <div className="button-group">
          <button  formAction={login}>Log In</button>
          <button formAction={signup}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}
