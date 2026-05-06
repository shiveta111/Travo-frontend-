import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../auth/AuthContext';

interface LoginProps {
  onLogin: () => void;
}

export function Login({
  onLogin
}: LoginProps) {

  const { login } = useAuth();
  const [email, setEmail] =
    useState('');
  const [password, setPassword] =
    useState('');
  const [showPassword,
    setShowPassword] =
    useState(false);
  const [error, setError] =
    useState('');
  const [loading, setLoading] =
    useState(false);


  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError('');

    setLoading(true);


    try {

      const response =
        await loginUser({

          email,
          password

        });

      login(
        response.user,
        response.accessToken
      );

      onLogin();

    } catch (error: any) {

      setError(

        error?.response?.data?.message ||

        'Login failed'

      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">

      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-8">

        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">

          DMC Hub Travo AI

        </h2>

        <p className="text-sm text-[var(--muted-foreground)] mb-6">

          Enter your credentials to continue

        </p>


        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="text-sm text-[var(--foreground)] mb-2 block">

              Email

            </label>


            <div className="relative">

              <Mail
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-[var(--muted-foreground)]
                "
              />


              <input
                type="email"
                placeholder="Enter your email"
                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }

                required

                className="
                  w-full
                  pl-10
                  pr-4
                  py-2.5
                  bg-[var(--input-background)]
                  text-[var(--foreground)]
                  placeholder:text-[var(--muted-foreground)]
                  border border-[var(--border)]
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ring)]
                "
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div>

            <label className="text-sm text-[var(--foreground)] mb-2 block">

              Password

            </label>


            <div className="relative">

              <Lock
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-[var(--muted-foreground)]
                "
              />


              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                placeholder="Enter your password"

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }

                required

                className="
                  w-full
                  pl-10
                  pr-10
                  py-2.5
                  bg-[var(--input-background)]
                  text-[var(--foreground)]
                  placeholder:text-[var(--muted-foreground)]
                  border border-[var(--border)]
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ring)]
                "
              />


              <button
                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--muted-foreground)]
                "
              >

                {
                  showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                }

              </button>

            </div>

          </div>


          {/* ERROR */}

          {
            error && (

              <div className="
                text-sm
                text-red-500
              ">

                {error}

              </div>

            )
          }


          {/* BUTTON */}

          <button
            type="submit"

            disabled={loading}

            className="
              w-full
              py-2.5
              bg-[var(--primary)]
              text-[var(--primary-foreground)]
              rounded-lg
              font-medium
              hover:opacity-90
              transition
              disabled:opacity-50
            "
          >

            {
              loading
                ? 'Signing In...'
                : 'Sign In'
            }

          </button>

        </form>

      </div>

    </div>

  );

}