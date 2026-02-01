import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';
import toast from 'react-hot-toast';
import AuthCard from '../ux/AuthCard';
import EmailInput from '../entities/EmailInput';
import PasswordInput from '../entities/PasswordInput';
import Button from '../ux/Button';
import ErrorMessage from '../ux/ErrorMessage';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .refine(validateEmail, 'Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <AuthCard title="Sign in to your account">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm -space-y-px">
          <EmailInput
            {...register('email')}
            error={errors.email?.message}
            rounded="top"
          />
          <PasswordInput
            {...register('password')}
            error={errors.password?.message}
            rounded="bottom"
            autoComplete="current-password"
          />
        </div>

        <ErrorMessage message={error ?? undefined} />

        <div>
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>

        <div className="text-sm text-center">
          <span className="text-slate-400">Don't have an account? </span>
          <Link
            to="/register"
            className="font-medium text-fuchsia-400 hover:text-fuchsia-300"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginForm;

